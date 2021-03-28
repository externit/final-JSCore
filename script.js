$(() => {
    const trueArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    const randImage = () => {
        let randomArr = trueArr.slice().sort(() => Math.random() - 0.5);
        let tds = $('.start-block td>img');
        for (let i = 0; i < tds.length; i++){ tds[i].setAttribute('src', `images/image_part_${randomArr[i]}.jpg`);}
    };
    randImage();

    $('.modal').hide();
    $.fn.shuffleChildren = function () {
        $.each(this.get(), function (index, el) {
            let $el = $(el);
            let $find = $el.children();

            $find.sort(function () {
                return 0.5 - Math.random();
            });

            $el.empty();
            $find.appendTo($el);
        });
    };

    let timerID;
    let mmTimer = 0;
    let ssTimer = 59;
    let timer = function () {
        ssTimer--;
        if (ssTimer < 0) {
            mmTimer = mmTimer - 1;
            ssTimer = ssTimer + 60;
        }
        if (mmTimer == 0 && ssTimer == 0) {
            clearInterval(timerID);
        }

        if (ssTimer < 10) {
            $('#count').text(`0${mmTimer}:0${ssTimer}`);
        } else {
            $('#count').text(`0${mmTimer}:${ssTimer}`);
        }

        if (ssTimer == 0) {
            $('.puzzle-cut').draggable('disable');
            $('.modal p').text(`Time is out, you lost`);
            $('#check').hide();
            $('.modal').show();
            $('.modal').css({
                backgroundColor: 'red'
            });
            $('.modal-container').css({
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 2

            });

            document.querySelector('#checkRes').disabled = true;
            document.querySelector('#start').disabled = true;
        }
    };

    $('#close').on('click', function () {
        $('.modal p').text(`You still have time, you sure?`);
        $('.modal').hide();
        $('.modal-container').css({
            backgroundColor: 'white',
            zIndex: -1
        });
        $('.modal').css({
            backgroundColor: 'wheat'
        });

    });

    $('#refresh').on('click', function () {
        $('#count').text(`00:59`);
        ssTimer = 59;
        clearInterval(timerID);
        
        let allFromStartBlock = Array.from($('.start-block td>img'));
        let allFromResBlock = Array.from($('.result-block td>img'));
        let allImages = allFromResBlock.concat(allFromStartBlock);
        for (let i = 0; i < $('.start-block td').length; i++) $('.start-block td')[i].append(allImages[i]);
        document.querySelector('#start').disabled = false;
        document.querySelector('#checkRes').disabled = true;
        $('.result-block td').droppable("enable");
        $('td').not('td:empty').droppable("disable");
        randImage();

    });

    $("#start").click(function () {
        timerID = setInterval(() => {
            timer();
        }, 1000);
        $('#check').show();
    $('.result-block td').droppable("enable");

        document.querySelector('#checkRes').disabled = false;
        document.querySelector('#start').disabled = true;
    });

    
    $('img').draggable({
        containment: ".container",
        revert: 'invalid'
    });

    $('td').droppable({
        drop: function (ev, ui) {
            let droppableItem = ui.draggable;
            let droppableArea = $(this);
            $(droppableArea).droppable("disable");
            $(droppableItem).parent().droppable("enable");
            $(droppableItem).detach().css({
                top: 0,
                left: 0
            }).appendTo(droppableArea);
            let resArr = Array.from($('.result-block td>img'));
        }
    });

    const checkCorrectness = () => {
        let resArr = Array.from($('.result-block td>img'));
        if (resArr.length != 16){
            $('.modal p').text(`It's a pity, but you lost`);
                document.querySelector('#checkRes').disabled = true;
                clearInterval(timerID);
                $('#check').hide();
                $('.modal').css({
                    backgroundColor: 'red'
                });
                $('.puzzle-cut').draggable('disable');
        }
        else {
            let checker = true;
            for (let index = 0; index < trueArr.length; index++) {
                if (resArr[index].getAttribute('src') != `images/image_part_${index + 1}.jpg`){ checker = false;}
            }
            if (checker == false){
                $('.modal p').text(`It's a pity, but you lost`);
                document.querySelector('#checkRes').disabled = true;
                clearInterval(timerID);
                $('#check').hide();
                $('.modal').css({
                    backgroundColor: 'red'
                });
                $('.puzzle-cut').draggable('disable');
            }
            else if (checker == true){
                $('.modal p').text(`Woohoo, well done, you did it!`);
            document.querySelector('#checkRes').disabled = true;
            clearInterval(timerID);
            $('#check').hide();
            $('.modal').css({
                backgroundColor: 'green'
            });
            $('.puzzle-cut').draggable('disable');
            } 
        }
    };

    $('#check').on('click', function () {
        checkCorrectness();
    });

    $('#refresh').on('click', function () {
        randImage();

        $(".checkResult").prop("disabled", true);
        $(".startGame").prop("disabled", false);
        document.querySelector('#start').disabled = false;
    });
    $('#checkRes').on('click', function () {
        $('.modal').show();
        $('.modal-container').css({
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 2
        });
    });
    $('.result-block td').droppable("disable");

    $('td').not('td:empty').droppable("disable");
});