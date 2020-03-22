$(document).ready(function(e){
    $("#form-data").on("submit",(function(e) {
        $("#track-information").empty();
        $("#track-information").html(`
            <div id="load" class="pt-5 w-100 ml-md-center">
                <div class="col-sm">
                    <img class="rounded mx-auto d-block loader" src="images/loader.gif">
                </div>
                <div class="col-sm text-center">
                    <h2>Получение данных...</h2><br>
                </div>
            </div>
        `);

        $.ajax({
            url: 'https://api.track24.ru/tracking.json.php',
            method: 'POST',
            dataType: 'JSON',
            data: $(this).serialize(),
            success: function(data){
                if(data.status == "ok") {
                    $("#track-information").empty();
                    $("#track-information").append(`
                        <!-- инфо блок -->
                        <div id="tracking" class="col-md-4 col-lg-4">
                            <div class="title title-name pb-3">
                                <svg viewBox="0 0 43 37" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h2.688v37H0V0zM21.5 0h5.375v37H21.5V0zM29.563 0h2.687v37h-2.688V0zM34.938 0h2.687v37h-2.688V0zM40.313 0H43v37h-2.688V0zM5.375 0h8.063v37H5.374V0zM16.125 0h2.688v37h-2.688V0z" fill="#222"></path></svg>
                                <h3 id="code" class="track-name"></h3>
                            </div>
                            <div class="row m-0 justify-content-between flex-nowrap">
                                <p class="gray">Точка отправления</p>
                                <p id="fromCountry"></p>
                            </div>
                            <div class="row m-0 justify-content-between flex-nowrap">
                                <p class="gray">Точка доставки</p>
                                <p id="destinationCountry"></p>
                            </div>
                            <div class="row m-0 justify-content-between flex-nowrap">
                                <p class="gray">Общее время в пути</p>
                                <p id="days"></p>
                            </div>
                            <div class="row m-0 justify-content-between flex-nowrap">
                                <p class="gray">Найдено в почтовых службах</p>
                                <p id="groupedCompanyNames" style="text-align: right;"></p>
                            </div>
                        </div>
                        <!-- трекинг блок -->
                        <div class="col-md-8 col-lg-8">
                            <div id="tracking">
                                <div id="events" class="tracking-list">                        
                                </div>
                            </div>
                        </div>
                        `);
                    // Общая информация
                    $("#code").text($('input[name="code"]').val());
                    $("#fromCountry").text(data.data.fromCountry);
                    $("#destinationCountry").text(data.data.destinationCountry);
                    $("#days").text(data.data.daysInTransit + " д.");
                    // Найдено в почтовых службах
                    $.each(data.data.groupedCompanyNames, function(index, value){
                        $("#groupedCompanyNames").append(value + "<br>");
                    });
                    // Транзит
                    $.each(data.data.events, function(index, value){
                        let tmp = value.operationDateTime.split(' ');
                        $("#events").prepend(`
                            <div class="tracking-item">
                                <p></p>
                                <div class="tracking-date">${tmp[0]}<span>${tmp[1]}</span></div>
                                <div class="float-right">${value.serviceName}</div>
                                <div class="tracking-content">${value.operationAttributeTranslated.toUpperCase()}<span>${value.operationPlaceNameTranslated.toUpperCase()}</span></div>
                            </div>
                        `);
                    });
                } else {
                    $("#track-information").empty();
                    $("#track-information").html(`
                        <div id="error" class="row pt-5">
                            <div class="col-md-4">
                                <img class="rounded mx-auto d-block" src="images/icon-attention.png">
                            </div>
                            <div class="col-md-8 text-center">
                                <h2>УПС! Это неизвестный трек-номер</h2><br>
                                <h4>Мы не смогли определить службу, которая занимается доставкой Вашей посылки</h4>
                                <h4>Возможно, у Вас на руках не настоящий трек-код, проверьте правильно ли введен трек-код.</h4>
                            </div>
                        </div>
                    `);
                }
            },
            error: function(){
                $('#output').text('Error! No data was sent');
            }
        });
        return false;
    }));
});