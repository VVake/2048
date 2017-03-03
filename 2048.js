        var board = new Array(); //记录分数
        var score = 0;
        var has_conflicted = new Array();
        var successString = 'Success';
        var gameOverString = 'GameOver';
        $(function() {
            newGame();
        })
        function newGame() {
            init();
            generateNumber();
            generateNumber();
        }

        function init() {
            $("#score").html(0);
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    var gridCell = $('#grid_cell_' + i + '_' + j);
                    gridCell.css({
                        'top': 20 + i * 120,
                        'left': 20 + j * 120
                    })
                }
            }
            for (var i = 0; i < 4; i++) {
                board[i] = new Array();
                has_conflicted[i] = new Array();
                for (var j = 0; j < 4; j++) {
                    board[i][j] = 0;
                    has_conflicted[i][j] = false;
                }
            }
            updateBoardView();
        }

        function updateBoardView() {
            $('.number_cell').remove();
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    $('#grid_container').append('<div class="number_cell" id="number_cell_' + i + '_' + j + '"></div>');
                    var numberCell = $('#number_cell_' + i + '_' + j + '');
                    if (board[i][j] == 0) {
                        numberCell.css({
                            'width': 0,
                            'height': 0,
                            'top': 20 + i * 120 + 50,
                            'left': 20 + j * 120 + 50
                        });
                    } else {
                        numberCell.css({
                            'width': 100,
                            'height': 100,
                            'top': 20 + i * 120,
                            'left': 20 + j * 120,
                            'backgroundColor': getBackgroundColor(board[i][j]),
                            'color': getColor(board[i][j])
                        });
                        numberCell.text(board[i][j]);
                    }
                    has_conflicted[i][j] = false;
                }
            }
            $('.number_cell').css('lineHeight', '100px');
            $('.number_cell').css('fontSize', '60px')
        }

        function getBackgroundColor(number) {
            switch (number) {
                case 2:
                    return '#eee4da';
                    break;
                case 4:
                    return '#ede0c8';
                    break;
                case 8:
                    return '#f2b179';
                    break;
                case 16:
                    return '#f59563';
                    break;
                case 32:
                    return '#f67c5f';
                    break;
                case 64:
                    return '#f65e3b';
                    break;
                case 128:
                    return '#edcf72';
                    break;
                case 256:
                    return '#edcc61';
                    break;
                case 512:
                    return '#9c0';
                    break;
                case 1024:
                    return '#33b5e5';
                    break;
                case 2048:
                    return '#09c';
                    break;
                case 4096:
                    return '#a6c';
                    break;
                case 8192:
                    return '#93c';
                    break;
            }
            return 'black';
        }

        function getColor(num) {
            if (num <= 4) {
                return '#776e65';
            }
            return 'white';
        }

        function generateNumber() {
            if (checkSpace(board)) {
                return false;
            }
            var randx = parseInt(Math.floor(Math.random() * 4));
            var randy = parseInt(Math.floor(Math.random() * 4));
            var time = 0;
            while (time < 50) {
                if (board[randx][randy] == 0) {
                    break;
                }
                randx = parseInt(Math.floor(Math.random() * 4));
                randy = parseInt(Math.floor(Math.random() * 4));
                time++;
            }
            if (time == 50) {
                for (var i = 0; i < 4; i++) {
                    for (var j = 0; j < 4; j++) {
                        if (board[i][j] == 0) {
                            randx = i;
                            randy = j;
                        }
                    }
                }
            }
            var rand = Math.random() < 0.5 ? 2 : 4;
            board[randx][randy] = rand;
            showNum(randx, randy, rand);
            return true;
        }

        function showNum(i, j, rand) {
            var numberCell = $('#number_cell_' + i + '_' + j + '');
            numberCell.css({
                'backgroundColor': getBackgroundColor(rand),
                'color': getColor(rand)
            });
            numberCell.text(rand);
            numberCell.animate({
                width: 100,
                height: 100,
                top: 20 + 120 * i,
                left: 20 + 120 * j
            }, 50);
        }

        function checkSpace(board) {
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    if (board[i][j] == 0) {
                        return false;
                    }
                }
            }
            return true;
        }
        $(document).keydown(function(event) {
            if ($('#score').text() == successString) {
                newGame();
                return;
            }
            switch (event.keyCode) {
                case 37: //left
                    event.preventDefault();
                    if (moveLeft()) {
                        setTimeout('generateNumber()', 210);
                        setTimeout('isGameOver()', 300);
                    }
                    break;
                case 38: //up
                    event.preventDefault();
                    if (moveUp()) {
                        setTimeout('generateNumber()', 210);
                        setTimeout('isGameOver()', 300);
                    }
                    break;
                case 39: //right
                    event.preventDefault();
                    if (moveRight()) {
                        setTimeout('generateNumber()', 210);
                        setTimeout('isGameOver()', 300);
                    }
                    break;
                case 40: //down
                    event.preventDefault();
                    if (moveDown()) {
                        setTimeout('generateNumber()', 210);
                        setTimeout('isGameOver()', 300);
                    }
                    break;
                default:
                    break;
            }
        })

        function moveLeft() {
            if (!canMoveLeft(board)) {
                return false;
            }
            for (var i = 0; i < 4; i++) {
                for (var j = 1; j < 4; j++) {
                    if (board[i][j] != 0) {
                        for (var k = 0; k < j; k++) {
                            if (board[i][k] == 0 && noHorizontalBlock(i, k, j, board)) {
                                showMoveAnimation(i, j, i, k);
                                board[i][k] = board[i][j];
                                board[i][j] = 0;
                                break;
                            } else if (board[i][k] == board[i][j] && noHorizontalBlock(i, k, j, board) && !has_conflicted[i][k]) {
                                showMoveAnimation(i, j, i, k);
                                board[i][k] += board[i][j];
                                board[i][j] = 0;
                                score += board[i][k];
                                updateScore(score);
                                has_conflicted[i][k] = true;
                                break;
                            }
                        }
                    }
                }
            }
            setTimeout('updateBoardView()', 200);
            return true;
        }

        function moveRight() {
            if (!canMoveRight(board)) {
                return false;
            }
            for (var i = 0; i < 4; i++) {
                for (var j = 2; j >= 0; j--) {
                    if (board[i][j] != 0) {
                        for (var k = 3; k > j; k--) {
                            if (board[i][k] == 0 && noHorizontalBlock(i, j, k, board)) {
                                showMoveAnimation(i, j, i, k);
                                board[i][k] = board[i][j];
                                board[i][j] = 0;
                                break;
                            } else if (board[i][k] == board[i][j] && noHorizontalBlock(i, j, k, board) && !has_conflicted[i][k]) {
                                showMoveAnimation(i, j, i, k);
                                board[i][k] += board[i][j];
                                board[i][j] = 0;
                                score += board[i][k];
                                updateScore(score);
                                has_conflicted[i][k] = true;
                                break;
                            }
                        }
                    }
                }
            }
            setTimeout('updateBoardView()', 200);
            return true;
        }

        function moveUp() {
            if (!canMoveUp(board)) {
                return false;
            }
            for (var j = 0; j < 4; j++) {
                for (var i = 1; i < 4; i++) {
                    if (board[i][j] != 0) {
                        for (var k = 0; k < i; k++) {
                            if (board[k][j] == 0 && noVerticalBlock(j, k, i, board)) {
                                showMoveAnimation(i, j, k, j);
                                board[k][j] = board[i][j];
                                board[i][j] = 0;
                                break;
                            } else if (board[k][j] == board[i][j] && noVerticalBlock(j, k, i, board) && !has_conflicted[k][j]) {
                                showMoveAnimation(i, j, k, j);
                                board[k][j] += board[i][j];
                                board[i][j] = 0;
                                score += board[k][j];
                                updateScore(score);
                                has_conflicted[k][j] = true;
                                break;
                            }
                        }
                    }
                }
            }
            setTimeout('updateBoardView()', 200);
            return true;
        }

        function moveDown() {
            if (!canMoveDown(board)) {
                return false;
            }
            for (var j = 0; j < 4; j++) {
                for (var i = 2; i >= 0; i--) {
                    if (board[i][j] != 0) {
                        for (var k = 3; k > i; k--) {
                            if (board[k][j] == 0 && noVerticalBlock(j, i, k, board)) {
                                showMoveAnimation(i, j, k, j);
                                board[k][j] = board[i][j];
                                board[i][j] = 0;
                                break;
                            } else if (board[k][j] == board[i][j] && noVerticalBlock(j, i, k, board) && !has_conflicted[k][j]) {
                                showMoveAnimation(i, j, k, j);
                                board[k][j] += board[i][j];
                                board[i][j] = 0;
                                score += board[k][j];
                                updateScore(score);
                                has_conflicted[k][j] = true;
                                break;
                            }
                        }
                    }
                }
            }
            setTimeout('updateBoardView()', 200);
            return true;
        }

        function isGameOver() {
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    if (board[i][j] == 2048) {
                        updateScore(successString);
                        return;
                    }
                }
                if (checkSpace(board) && nomove(board)) {
                    updateScore(gameOverString);
                }
            }
        }

        function updateScore(score) {
            $('#score').text(score);
        }

        function nomove(board) {
            if (canMoveDown(board) || canMoveUp(board) || canMoveLeft(board) || canMoveRight(board)) {
                return false;
            }
            return true;
        }

        function canMoveRight(board) {
            for (var i = 0; i < 4; i++) {
                for (var j = 2; j >= 0; j--) {
                    if (board[i][j] != 0) {
                        if (board[i][j + 1] == 0 || board[i][j] == board[i][j + 1]) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        function canMoveLeft(board) {
            for (var i = 0; i < 4; i++) {
                for (var j = 1; j < 4; j++) {
                    if (board[i][j] != 0) {
                        if (board[i][j - 1] == 0 || board[i][j] == board[i][j - 1]) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        function canMoveUp(board) {
            for (var j = 0; j < 4; j++) {
                for (var i = 1; i < 4; i++) {
                    if (board[i][j] != 0) {
                        if (board[i - 1][j] == 0 || board[i - 1][j] == board[i][j]) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        function canMoveDown(board) {
            for (var j = 0; j < 4; j++) {
                for (var i = 2; i >= 0; i--) {
                    if (board[i][j] != 0) {
                        if (board[i + 1][j] == 0 || board[i + 1][j] == board[i][j]) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        function noHorizontalBlock(row, col1, col2, board) {
            for (var i = col1 + 1; i < col2; i++) {
                if (board[row][i] != 0) {
                    return false;
                }
            }
            return true;
        }

        function noVerticalBlock(col, row1, row2, board) {
            for (var i = row1 + 1; i < row2; i++) {
                if (board[i][col] != 0) {
                    return false;
                }
            }
            return true;
        }

        function showMoveAnimation(initialX, initialY, toX, toY) {
            var numberCell = $('#number_cell_' + initialX + '_' + initialY + '');
            numberCell.animate({
                top: getTop(toX, toY),
                left: getLeft(toX, toY)
            }, 200);
        }

        function getTop(i, j) {
            return 20 + i * 120;
        }

        function getLeft(i, j) {
            return 20 + j * 120;
        }
        //监听移动设备
        var startx = 0;
        var starty = 0;
        document.addEventListener('touchStart', function(event) {
            startx = event.touches[0].pageX;
            starty = event.touches[0].pageY;
        });
        document.addEventListener('touchMove', function() {
            event.preventDefault();
        })
        document.addEventListener('touchend', function(event) {
            endx = event.changedTouches[0].pageX;
            endy = event.changedTouches[0].pageY;

            var deltax = endx - startx;
            var deltay = endy - starty;
            if (Math.abs(deltax) < 0.3 * document_width && Math.abs(deltay) < 0.3 * document_width) {
                return;
            }
            if ($('#score').text() == successString) {
                new_game();
                return;
            }
            //x
            if (Math.abs(deltax) >= Math.abs(deltay)) {
                if (deltax > 0) {
                    //move right
                    if (moveRight()) {
                        setTimeout('generateNumber()', 210);
                        setTimeout('isGameOver()', 300);
                    }
                } else {
                    //move left
                    if (moveLeft()) {
                        setTimeout('generateNumber()', 210);
                        setTimeout('isGameOver()', 300);
                    }
                }
            } else { //y
                if (deltay > 0) {
                    //move down
                    if (moveDown()) {
                        setTimeout('generateNumber()', 210);
                        setTimeout('isGameOver()', 300);
                    }
                } else {
                    //move up
                    if (moveUp()) {
                        setTimeout('generateNumber()', 210);
                        setTimeout('isGameOver()', 300);
                    }
                }
            }
        });