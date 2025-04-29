<?php

if (!defined('ABSPATH')) {
    require_once('../../../../../wp-load.php'); // Adjust the path if needed
}

function insertPerson($id, $name, $image, $type, $role, $group, $genre)
{
    global $wpdb;

    $table_name = $wpdb->prefix . 'person'; // WordPress table with prefix
    $sort = (int)$id;

    try {
        $data = [
            'id'            => $id, // Use $id_pk as the unique identifier for REPLACE
            'name'          => $name,
            'image'         => $image,
            'sort'          => $sort,
            'type'          => $type,
            'group_person'  => $group,
            'genre'         => $genre,
            'role'          => $role,
            'created_at'    => current_time('mysql'),
            'updated_at'    => current_time('mysql'),
        ];

        $format = ['%s', '%s', '%s', '%d', '%s', '%s', '%s', '%s', '%s', '%s'];

        $result = $wpdb->replace($table_name, $data, $format);

        if ($result === false) {
            throw new Exception("Database Replace Error: " . $wpdb->last_error);
        }

        return true;
    } catch (Exception $e) {
        error_log("Error replacing person: " . $e->getMessage());
        return false;
    }
}
