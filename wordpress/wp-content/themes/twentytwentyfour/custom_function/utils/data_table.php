<?php
require_once('../../../../../wp-load.php'); // Adjust the path if needed
add_action('wp_ajax_generate_datatable', 'generate_datatable');  // for logged-in users
add_action('wp_ajax_nopriv_generate_datatable', 'generate_datatable'); 
function generate_datatable($data, $columns) {
    echo 'Data table generated successfully.';
    wp_die();
    if (empty($data) || empty($columns)) {
        return '<p>No data available.</p>';
    }
    echo 123;

    ob_start(); ?>
    <table id="csvDataTable" class="display" style="width: 100%;">
        <thead>
            <tr>
                <?php foreach ($columns as $column) : ?>
                    <th><?php echo esc_html($column); ?></th>
                <?php endforeach; ?>
                <th>Actions</th> <!-- Edit/Delete Column -->
            </tr>
        </thead>
        <tbody>
            <?php foreach ($data as $row) : ?>
                <tr>
                    <?php foreach ($columns as $column) : ?>
                        <td contenteditable="true"><?php echo esc_html($row[$column]); ?></td>
                    <?php endforeach; ?>
                    <td>
                        <button class="delete-row button button-small">Delete</button>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    <button id="saveChanges" class="button button-primary">Save Changes</button>

    <script>
        jQuery(document).ready(function($) {
            var table = $('#csvDataTable').DataTable({
                paging: true,
                searching: true,
                responsive: true
            });

            $('.delete-row').click(function() {
                $(this).closest('tr').remove();
            });

            $('#saveChanges').click(function() {
                let editedData = [];
                $('#csvDataTable tbody tr').each(function() {
                    let rowData = {};
                    $(this).find('td:not(:last-child)').each(function(index) {
                        rowData["<?php echo implode('","', $columns); ?>".split('","')[index]] = $(this).text();
                    });
                    editedData.push(rowData);
                });

            });
        });
    </script>
    <?php return ob_get_clean();
}
?>
