// Get the modal
var modal = document.getElementById('addUserModal');

// Get the button that opens the modal
var btn = document.querySelector('.add-user-btn');

// Get the <span> element that closes the modal
var span = document.querySelector('.close');

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// TODO: Implement form submission logic and update the user list
