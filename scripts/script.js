$(document).ready(function(e){
    $("#form-data").on("submit",(function(e) {
        e.preventDefault();
        $.ajax({
            url: 'url to api',
            method: 'POST',
            dataType: 'JSON',
            data: $(this).serialize(),
            success: function(data){
                $('#output').html(data);
            },
            error: function(){
                $('#output').text('Error! No data was sent');
            }
        });
        return false;
    }));
});