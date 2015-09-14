$(document).ready(function(){

	// WebSocket
	var socket = io.connect();

	// neue Nachricht
	socket.on('chat', function (data) {
		var zeit = new Date(data.zeit);
		var timestamp = ((zeit.getDate() < 10 ? '0' + zeit.getDate() : zeit.getDate()) + "." + ((zeit.getMonth()+1) < 10 ? '0' + (zeit.getMonth()+1) : (zeit.getMonth()+1)) + "." + zeit.getFullYear() + " " + (zeit.getHours() < 10 ? '0' + zeit.getHours() : zeit.getHours()) + ':' + (zeit.getMinutes() < 10 ? '0' + zeit.getMinutes() : zeit.getMinutes()));
		console.log(timestamp);
		$('#content').append(
			$('<li></li>').append(
				// Uhrzeit
				$('<span>').text('[' + timestamp + '] '),
				// Name
				$('<b>').text(typeof(data.name) != 'undefined' ? data.name + ': ' : ''),
				// Text
				$('<span>').text(data.text))
		);
		// nach unten scrollen
		$('body').scrollTop($('body')[0].scrollHeight);
	});

	// Nachricht senden
	function send(){
		// Eingabefelder auslesen
		var name = $('#name').val();
		var text = $('#text').val();
		// Socket senden
		socket.emit('chat', { name: name, text: text });
		// Text-Eingabe leeren
		$('#text').val('');
	}

	// Nachricht senden
	function clear() {
        // Serverseitig löschen
        $.post('/clear', function (data) {
            $('#content').empty();
        });
    }

	// bei einem Klick
	$('#send').click(send);

	// oder mit der Enter-Taste
	$('#text').keypress(function (e) {
		if (e.which == 13) {
			send();
		}
	});

	// bei einem Klick
	$('#clear').click(clear);
});