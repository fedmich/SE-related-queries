<?php
// backend.php
include 'config.php';
include 'db.php';

$action = $_POST['action'] ?? $_GET['action'] ?? '';

if ($action === 'add_query') {
    $mainQuery = sanitize($_POST['mainQuery']);
    $relatedQueries = sanitize($_POST['relatedQueries']);

    $conn = dbConnect(); // Connect to the database

    if (queryExists($conn, $mainQuery)) {
        echo json_encode(["success" => false, "message" => "Main query already exists!"]);
        exit();
    }

    // Insert main query
    $stmt = $conn->prepare("INSERT INTO queries (query_text) VALUES (?)");
    $stmt->bind_param("s", $mainQuery);
    $stmt->execute();
    $queryId = $stmt->insert_id;
    $stmt->close();

    // Insert related queries
    $relatedQueriesArray = explode("\n", $relatedQueries);
    foreach ($relatedQueriesArray as $relatedQuery) {
        $relatedQuery = sanitize($relatedQuery);
        if (!empty($relatedQuery)) {
            $stmt = $conn->prepare("INSERT INTO related_queries (query_id, related_query_text) VALUES (?, ?)");
            $stmt->bind_param("is", $queryId, $relatedQuery);
            $stmt->execute();
            $stmt->close();
        }
    }

    echo json_encode(["success" => true, "message" => "Queries added successfully!"]);
    exit();
}

if ($action === 'get_queries') {
    $conn = dbConnect(); // Connect to the database
    $result = $conn->query("SELECT id, query_text FROM queries");
    $queries = [];
    while ($row = $result->fetch_assoc()) {
        $queries[] = $row;
    }
    echo json_encode(["success" => true, "queries" => $queries]);
    exit();
}

if ($action === 'get_related') {
    $queryId = (int)$_GET['id'];
    $conn = dbConnect(); // Connect to the database
    $stmt = $conn->prepare("SELECT related_query_text FROM related_queries WHERE query_id = ?");
    $stmt->bind_param("i", $queryId);
    $stmt->execute();
    $result = $stmt->get_result();

    $relatedQueries = [];
    while ($row = $result->fetch_assoc()) {
        $relatedQueries[] = $row;
    }

    echo json_encode(["success" => true, "related" => $relatedQueries]);
    exit();
}
?>