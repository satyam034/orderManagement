import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { pool } from '../db';
import { generateOrderId } from '../utils';
import { producer, connectProducer } from '../kafka';

@Injectable()
export class OrdersService implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);

  async onModuleInit() {
    // connect kafka producer once at module init
    try {
      await connectProducer();
    } catch (e: unknown) {
      if (e instanceof Error) {
        this.logger.warn('Kafka producer may not be available: ' + e.message);
      } else {
        this.logger.warn('Kafka producer may not be available: Unknown error');
      }
    }
  }

  async createOrder(userId: number, amount: number) {
    const orderId = generateOrderId();
    const conn = await pool.getConnection();
    try {
      const [res]: any = await conn.query(
        'INSERT INTO orders (order_id, user_id, amount) VALUES (?, ?, ?)',
        [orderId, userId, amount]
      );
      const insertedId = res.insertId;

      // emit event to kafka
      const payload = {
        order_id: orderId,
        user_id: userId,
        amount: Number(amount),
        created_at: new Date().toISOString(),
      };

      try {
        await producer.send({
          topic: 'orders.created',
          messages: [{ value: JSON.stringify(payload) }],
        });
        this.logger.log('Emitted order event to Kafka: ' + JSON.stringify(payload));
      } catch (e: unknown) {
        if (e instanceof Error) {
          this.logger.warn('Failed to send to Kafka: ' + e.message);
        } else {
          this.logger.warn('Failed to send to Kafka: Unknown error');
        }
      }

      return { ok: true, order_id: orderId, id: insertedId };
    } finally {
      conn.release();
    }
  }

  async getOrdersForUser(userId: number) {
    const conn = await pool.getConnection();
    try {
      const [rows]: any = await conn.query(
        'SELECT order_id, amount, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      return rows;
    } finally {
      conn.release();
    }
  }

  async getOrderById(orderId: string) {
    const conn = await pool.getConnection();
    try {
      const [rows]: any = await conn.query(
        'SELECT o.order_id, o.amount, o.created_at, u.mobile FROM orders o JOIN users u ON o.user_id = u.id WHERE o.order_id = ?',
        [orderId]
      );
      return rows[0] || null;
    } finally {
      conn.release();
    }
  }
}
