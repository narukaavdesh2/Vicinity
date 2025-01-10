
function toggleOtherInput() {
    const propertyType = document.getElementById('propertyType').value;
    const otherInput = document.getElementById('otherInput');

    if (propertyType === 'other') {
        otherInput.style.display = 'block';
    } else {
        otherInput.style.display = 'none';
    }
}

function toggleOtherService() {
    const otherCheckbox = document.getElementById('service6');
    const otherServiceInput = document.getElementById('otherServiceInput');

    if (otherCheckbox.checked) {
        otherServiceInput.style.display = 'block'; // Show text area if 'Other' is checked
    } else {
        otherServiceInput.style.display = 'none'; // Hide text area if 'Other' is unchecked
    }
}
