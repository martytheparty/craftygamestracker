let winners;
let winnersDict = {};

function getData()
{
    const recordDiv = document.getElementById('records');
    recordDiv.innerHTML = 'loading...';
    $.get('/api/winner.json?' + Date.now(),
    (data) => {
        winners = data;
        data = data.reverse();
        let html = '<table cellspacing="0" cellpadding="0">';
        html = html + '<tr class="table-heading"><th>winner</th><th>amt</th><th colspan="2">choice</th></tr>';
        data.forEach(
            (record) => {
                winnersDict[record.winner_name] = record;
                html = html + `<tr class='record'>
                    <td>${record.winner_name}</td>
                    <td>${record.winner_amt}</td>
                    <td>${record.winner_choice}</td>
                    <td><span class='delete' onclick="deleteWinner(${record.w_id})">x</span></td>
                    </tr>`;
            }
        );

        html = html + '</table>';
        recordDiv.innerHTML = html;
        populateNamesList();
        populateAmountsList();
    });
}

function addNewWinner()
{
    const name = document.getElementById('name').value;
    const amount = document.getElementById('amount').value;
    const choice = document.getElementById('choice').value;
    const addButton = document.getElementById('newWinnerButton');
    
    addButton.disabled = true;
    addButton.innerHTML = 'saving...';

    document.getElementById('name').value = "";
    document.getElementById('amount').value = "";
    document.getElementById('choice').value = "";

    const record = {
        winner_name: name,
        winner_amt: amount,
        winner_choice: choice
    };
    $.ajax({
        "url": "/api/wins.php",
        "data": JSON.stringify(record),
        "type": "POST",
        "dataType": "json",
        "contentType":"application/json; charset=utf-8",
        "success": ( record ) => {
            getData();
            addButton.disabled = false;
            addButton.innerHTML = "Add To List";
          },
        "error": function(jqXHR, textStatus, errorThrown) {
            addButton.disabled = false;
            addButton.innerHTML = "Add To List";
            alert(errorThrown);
        }
    });
}

function deleteWinner(winnerId)
{
    $.ajax({
        url: '/api/wins.php',
        type: 'DELETE',
        success: function(data) {
          getData();
        },
        data:  JSON.stringify({w_id: winnerId})
      });
}

function populateNamesList()
{
    const pastWinnersEl = document.getElementById('pastwinners');
    const markupStart = '<table>';
    const markupEnd = '</table>';
    let markup = '';
    
    Object.keys(winnersDict).forEach(
        (winnerName) => {
            const winner = winnersDict[winnerName];
            markup = markup + `<tr><td><span class="clickable" onclick="pastWinnerClick('${winner.winner_name}')">${winner.winner_name}</span></td></tr>`;
        }
    );

    pastWinnersEl.innerHTML = markupStart + markup + markupEnd;
}

function pastWinnerClick(winnerName)
{
    document.getElementById('name').value = winnerName;
}
function pastAmountClick(amount){
    document.getElementById("amount").value = amount
}

function populateAmountsList(){
    const pastAmountsEl = document.getElementById('pastamounts');
    const markupStart = '<table>';
    const markupEnd = '</table>';
    let markup = '';
    const amounts = winners.map((winner, i, ws)=>{
        return winner.winner_amt
    })
    amounts.forEach(
        (amt) => {
            markup = markup + `<tr><td><span class = "clickable" onclick="pastAmountClick(${amt})">${amt}</span</td></tr>`
        }
    )
   

        pastAmountsEl.innerHTML = markupStart + markup + markupEnd;
}

getData();