<?php

// require_once "db/db.php";


// function insertPerson($name, $image, $sort, $type)
// {
//     global $conn;

//     $stmt = $conn->prepare("
//         INSERT INTO at_person (name, image, sort, type, created_at, updated_at)
//         VALUES (?, ?, ?, ?, NOW(), NOW())
//     ");

//     if (!$stmt) {
//         die("Error preparing statement: " . $conn->error);
//     }

//     $stmt->bind_param("ssis", $name, $image, $sort, $type);

//     try {
//         $stmt->execute();
//     } catch (mysqli_sql_exception $e) {
//         echo "Error inserting screen writer: " . $e->getMessage() . "\n";
//     }

//     $stmt->close();
// }


if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust the path if needed
}

function insertPerson($id, $name, $image, $type, $role, $group, $genre)
{
    global $wpdb;

    $table_name = $wpdb->prefix . 'person'; // Ensure proper table prefix
    $sort = (int)$id; // Ensure integer type for sorting

    try {
        $result = $wpdb->insert(
            $table_name,
            [
                'id' => $id,
                'name' => $name,
                'image' => $image,
                'sort' => $sort,
                'type' => $type,
                'group_person' => $group,
                'genre' => $genre,
                'role' => $role,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ],
            ['%s', '%s', '%s', '%d', '%s', '%s', '%s', '%s'] // Correct format placeholders
        );

        if ($result === false) {
            throw new Exception("Database Insert Error: " . $wpdb->last_error);
        }

        return true; // Return true if successful
    } catch (Exception $e) {
        error_log("Error inserting person: " . $e->getMessage());
        return false; // Return false on failure
    }
}
