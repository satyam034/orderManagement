<?php
// simple order_summary.php
// Usage: order_summary.php?order_id=ord_...
$api = getenv('API_URL') ?: 'http://localhost:3001';

$order_id = isset($_GET['order_id']) ? $_GET['order_id'] : '';
if (!$order_id) {
  echo "<h3>Provide order_id as query parameter: ?order_id=ord_xyz</h3>";
  exit;
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $api . "/orders/" .$order_id ."?flag=1"); // not direct order fetch - we will GET all then filter
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
// For demo: this script expects a JWT in env or a local file for simple admin usage
$token = getenv('API_TOKEN') ?: '';
if ($token) {
  //curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: Bearer ' . $token));
}
$response = curl_exec($ch);
$http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http != 200) {
  echo "<h3>Failed to fetch orders: HTTP $http</h3>";
  echo "<pre>" . htmlentities($response) . "</pre>";
  exit;
}

$data = json_decode($response, true);
if (!isset($data['ok'])) {
  echo "<h3>Error: " . htmlentities(json_encode($data)) . "</h3>";
  exit;
}

if (!isset($data['order'])) {
  echo "<h3>Order not found</h3>";
  exit;
}

?>
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Order Summary - <?=htmlspecialchars($data['order']['order_id'])?></title>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; padding:20px;">
  <h2>Order Summary</h2>
  <div><strong>Order ID:</strong> <?=htmlspecialchars($data['order']['order_id'])?></div>
  <div><strong>Amount:</strong> <?=htmlspecialchars($data['order']['amount'])?></div>
  <div><strong>Created At:</strong> <?=htmlspecialchars($data['order']['created_at'])?></div>
</body>
</html>
