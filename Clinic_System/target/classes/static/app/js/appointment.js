$(function () {
    $('[data-mask]').inputmask()
    $('#booking-birthday-input').datetimepicker({
        format: 'L'
    });
    $('#booking-date-admission').datetimepicker({
        format: 'L'
    });

    var id = null;
    if(location.search.split('id=').length > 1){
        id = location.search.split('id=')[1];
        loadOldBooking(id);
    }
    if(location.href.split('/appointmentBooking').length > 1){
        $('.button-booking-button').show();
        $('.booking-room-class').show();
        $('.button-booking-button-register').hide();
        if(location.search.split('id=').length == 1){
            $('.button-booking-cancel').hide();
        }
        $('#booking-phone-input').keyup(function() {
            loadOldPatient();
        });
    }

    $('#booking-date-admission').keyup(function() {
        loadAllRoom();
    });

})

function bookingAction(){
    if(validateBooking()){
        var data = {};
        data.fullName = $('#booking-full-name-input').val();
        data.birthday = $('#booking-birthday-input').val();
        data.address = $('#booking-address-input').val();
        data.dateAdmission = $('#booking-date-admission').val();
        data.hourAdmission = $('#booking-hour-admission-input').val();
        data.gender = $('#booking-gender-input').val();
        data.phone = $('#booking-phone-input').val();
        data.email = $('#booking-email-input').val();
        data.nameCompanion = $('#booking-name-companion-input').val();
        data.phoneCompanion = $('#booking-phone-companion-input').val();
        data.companionRelationship = $('#booking-companion-relationship-input').val();
        data.description = $('#booking-description-input').val();
        $.ajax({
            type: "POST",
            url: "/booking/add" ,
            dataType: 'json',
            data: data,
            success: function (response) {
                if(response.responseCode == '00000'){
                    $(document).Toasts('create', {
                        class: 'bg-success',
                        title: 'Booking',
                        subtitle: '',
                        body: 'Booking successfully.'
                    });
                    $('.button-booking').hide();
                }else{
                    $(document).Toasts('create', {
                         class: 'bg-danger',
                         title: 'Booking',
                         subtitle: '',
                         body: response.message
                     });
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError);
            }
        });
    }
}

function validateBooking(){
    $('.error-app').remove();
    var check = true;
    var nameRegex = /^[a-zA-Z??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????\s\W|_]{2,}$/;
    var phoneRegex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var today = new Date();
    if($('#booking-phone-input').val().trim() !== ''){
        if(phoneRegex.test($('#booking-phone-input').val()) == false){
            $('#booking-phone-input').parent().after( $( '<p class="error-app" style="color: red;font-size: 14px;">S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng</p>' ) );
            check = false;
        }
    }else{
        $('#booking-phone-input').parent().after( $( '<p class="error-app" style="color: red;font-size: 14px;">S??? ??i???n tho???i kh??ng ???????c ????? tr???ng</p>' ) );
        check = false;
    }

    if($('#booking-full-name-input').val().trim() !== ''){
            if(nameRegex.test($('#booking-full-name-input').val()) == false){
                $('#booking-full-name-input').parent().after( $( '<p class="error-app" style="color: red;font-size: 14px;">T??n kh??ng ????ng ?????nh d???ng</p>' ) );
                check = false;
                }
        }else{
            $('#booking-full-name-input').parent().after( $( '<p class="error-app" style="color: red;font-size: 14px;">H??? v?? t??n kh??ng ????? tr???ng</p>' ) );
                check = false;
        }

    if($('#booking-email-input').val().trim() !== ''){
        if(emailRegex.test($('#booking-email-input').val()) == false){
            $('#booking-email-input').parent().after( $( '<p class="error-app" style="color: red;font-size: 14px;">Email kh??ng ????ng ?????nh d???ng</p>' ) );
            check = false;
        }
    }
    if($('#booking-birthday-input').val().trim() == ''){
        $('#booking-birthday-input').parent().after( $( '<p class="error-app" style="color: red;font-size: 14px;">Ng??y sinh kh??ng ????? tr???ng</p>' ) );
        check = false;
    }else{
        if(getFormattedDate2($('#booking-birthday-input').val().trim()) > getFormattedDate2(today)){
            $('#booking-birthday-input').parent().after( $( '<p class="error-app" style="color: red;font-size: 14px;">Ng??y sinh kh??ng ???????c l???n h??n ng??y hi???n t???i</p>' ) );
            check = false;
        }
        if(isNaN($('#booking-birthday-input').val().replaceAll('/',''))){
            $('#booking-birthday-input').parent().after( $( '<p class="error-app" style="color: red;font-size: 14px;">Ng??y sinh kh??ng ????? tr???ng</p>' ) );
            check = false;
        }
    }

    if($('#booking-date-admission').val().trim() == ''){
            $('#booking-date-admission').parent().after( $( '<p class="error-app" style="color: red;font-size: 14px;">Ng??y ?????t l???ch kh??ng ????? tr???ng</p>' ) );
            check = false;
        }else{
            if(getFormattedDate2($('#booking-date-admission').val().trim()) < getFormattedDate2(today)){
                $('#booking-date-admission').parent().after( $( '<p class="error-app" style="color: red;font-size: 14px;">Ng??y ?????t l???ch kh??ng ???????c nh??? h??n ng??y hi???n t???i</p>' ) );
                check = false;
            }
            if(isNaN($('#booking-date-admission').val().replaceAll('/',''))){
                $('#booking-date-admission').parent().after( $( '<p class="error-app" style="color: red;font-size: 14px;">Ng??y ?????t l???ch kh??ng ????? tr???ng</p>' ) );
                check = false;
            }
        }

    if($('#booking-address-input').val().trim() == ''){
            $('#booking-address-input').parent().after( $( '<p class="error-app" style="color: red;font-size: 14px;">D???a ch??? kh??ng ????? tr???ng</p>' ) );
            check = false;
    }
    if($('#booking-phone-companion-input').val().trim() !== ''){
          if(phoneRegex.test($('#booking-phone-companion-input').val()) == false){
              $('#booking-phone-companion-input').parent().after( $( '<p class="error-app" style="color: red;font-size: 14px;">S??? ??i???n tho???i ng?????i gi??m h??? kh??ng ????ng ?????nh d???ng</p>' ) );
              check = false;
         }
    }
    return check;
}

function getFormattedDate(dateInput) {
    var date = new Date(dateInput);
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return day + '/' + month + '/' + year;
}
function getFormattedDate2(dateInput) {
    var date = new Date(dateInput);
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return year + '/' + month + '/' + day;
}

function loadOldPatient(){
    var phone = $('#booking-phone-input').val();
    if(phone != ''){
        $.ajax({
            type: "GET",
            url: "/api/admission-record/getBookingByPhone?phone=" + phone,
            dataType: 'json',
            headers: {"token": localStorage.getItem('token'),"userid": localStorage.getItem('userid')},
            success: function (response) {
                if(response.responseCode == '00000'){
                    $('#booking-full-name-input').val(response.data.fullName);
                    $('#booking-birthday-input').val(getFormattedDate(response.data.birthday));
                    $('#booking-address-input').val(response.data.address);
                    $("#booking-gender-input option[data-value='" + response.data.gender +"']").attr("selected","selected");
                    $('#booking-phone-input').val(response.data.phone);
                    $('#booking-email-input').val(response.data.email);
                    $('#booking-patient-id-input').val(response.data.patientId);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError);
            }
        });
    }
}

function bookingChangeStatusAction(status){
    if(validateBooking() || status == 'cancel'){
    var data = {};
    data.id = $('#booking-id-input').val();
    data.fullName = $('#booking-full-name-input').val();
    data.birthday = $('#booking-birthday-input').val();
    data.address = $('#booking-address-input').val();
    data.dateAdmission = $('#booking-date-admission').val();
    data.hourAdmission = $('#booking-hour-admission-input').val();
    data.gender = $('#booking-gender-input').val();
    data.phone = $('#booking-phone-input').val();
    data.email = $('#booking-email-input').val();
    data.nameCompanion = $('#booking-name-companion-input').val();
    data.phoneCompanion = $('#booking-phone-companion-input').val();
    data.companionRelationship = $('#booking-companion-relationship-input').val();
    data.description = $('#booking-description-input').val();
    data.code = $('#booking-code-patient-input').val();
    data.patientId = $('#booking-patient-id-input').val();
    data.roomId = $('#booking-room-input').val();
    data.status = status;
    $.ajax({
        type: "POST",
        url: "/api/admission-record/updateStatusBooking" ,
        dataType: 'json',
        data: data,
        headers: {"token": localStorage.getItem('token'),"userid": localStorage.getItem('userid')},
        success: function (response) {
            if(response.responseCode == '00000'){
                $(document).Toasts('create', {
                    class: 'bg-success',
                    title: 'Booking',
                    subtitle: '',
                    body: 'Booking successfully.'
                });
//                location.href = '/doctor/calendar-management';
                location.href = '/doctor/booking-management';
            }else{
                $(document).Toasts('create', {
                     class: 'bg-danger',
                     title: 'Booking',
                     subtitle: '',
                     body: response.message
                 });
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError);
        }
    });
    }
}

function loadOldBooking(id){
    $.ajax({
        type: "GET",
        url: "/api/admission-record/getBookingById?id=" + id,
        dataType: 'json',
        headers: {"token": localStorage.getItem('token'),"userid": localStorage.getItem('userid')},
        success: function (response) {
            if(response.responseCode == '00000'){
                $('#booking-id-input').val(response.data.id);
                $('#booking-code-patient-input').val(response.data.code);
                $('#booking-full-name-input').val(response.data.fullName);
                $('#booking-birthday-input').val(getFormattedDate(response.data.birthday));
                $('#booking-address-input').val(response.data.address);
                $('#booking-date-admission').val(getFormattedDate(response.data.dateAdmission));
                $("#booking-hour-admission-input").val(response.data.hourAdmission);
                $("#booking-gender-input").val(response.data.gender);
                $('#booking-phone-input').val(response.data.phone);
                $('#booking-email-input').val(response.data.email);
                $('#booking-patient-id-input').val(response.data.patientId);
                $('#booking-name-companion-input').val(response.data.nameCompanion);
                $('#booking-phone-companion-input').val(response.data.phoneCompanion);
                $('#booking-companion-relationship-input').val(response.data.companionRelationship);
                $('#booking-description-input').val(response.data.description);
                $('#booking-patient-code-input').val(response.data.code);
                $('#booking-patient-code-input').parent().show();
                if(response.data.status == 'receive'){
                    $('#booking-status-input').val('???? nh???n');
                    $('.button-xac-nhan-lich-hen').hide();
                }else if(response.data.status == 'cancel'){
                    $('.button-xac-nhan-lich-hen').hide();
                    $('.button-tiep-nhan-lich-hen').hide();
                    $('#booking-status-input').val('???? h???y');
                } else{
                    if(response.data.status == 'waiting'){
                        $('#booking-status-input').val('??ang ch???');
                    }else if(response.data.status == 'confirm'){
                        $('#booking-status-input').val('???? x??c nh???n');
                    }
                    $('.button-xac-nhan-lich-hen').show();
                    $('.button-tiep-nhan-lich-hen').show();
                }
//                $('#booking-status-input').parent().show();
                loadAllRoom();
                if(response.data.roomId != undefined){
                    setTimeout(function () {
                        $("#booking-room-input option[data-value='" + response.data.roomId +"']").attr("selected","selected");
                    }, 500);

                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError);
        }
    });
}

function loadAllRoom(){
    var date = $('#booking-date-admission').val();
    if(date != ''){
        $.ajax({
            type: "GET",
            url: "/api/admission-record/getRoom?date=" + date,
            dataType: 'json',
            headers: {"token": localStorage.getItem('token'),"userid": localStorage.getItem('userid')},
            success: function (response) {
                if(response.responseCode == '00000'){
                    var html = '';
                    for(var i = 0; i < response.data.length; i++){
                        html += '<option value="' + response.data[i].id + '">' + response.data[i].name + '</option>';
                    }
                    $('#booking-room-input').html(html);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError);
            }
        });
    }
}



