function getData()
{
    const recordDiv = document.getElementById('records');
    recordDiv.innerHTML = 'loading...';
    $.get('http://games.craftybymelissa.xyz/api/wins.php',
    (data) => {
        data = data.reverse();
        let html = '<table>';
        html = html + '<tr><th>Winner Name</th><th>Amount</th><th>Choice</th></tr>';
        data.forEach(
            (record) => {
                html = html + `<tr>
                    <td>${record.winner_name}</td>
                    <td>${record.winner_amt}</td>
                    <td>${record.winner_choice}</td>
                    </tr>`;
            }
        );

        html = html + '</table>';
        recordDiv.innerHTML = html;
    });
}

function addNewWinner()
{
    const name = document.getElementById('name').value;
    const amount = document.getElementById('amount').value;
    const choice = document.getElementById('choice').value;

    const record = {
        winner_name: name,
        winner_amt: amount,
        winner_choice: choice
    };
    $.post("http://games.craftybymelissa.xyz/api/wins.php", JSON.stringify(record), ( record ) => {
        getData();
      },'json');

}

getData();