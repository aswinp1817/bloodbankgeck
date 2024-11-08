function openTab(tabName) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
}


function createProfile(event) {
    event.preventDefault();

    const user = {
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        phoneNumber: document.getElementById('regPhoneNumber').value,
        bloodGroup: document.getElementById('regBloodGroup').value,
        admissionNumber: document.getElementById('regAdmissionNumber').value,
        yearOfPassout: document.getElementById('yearOfPassout').value, // Updated
        stream: document.getElementById('regStream').value,
        age: parseInt(document.getElementById('regAge').value),
        weight: parseInt(document.getElementById('regWeight').value),
        password: document.getElementById('regPassword').value,
        lastDonationDate: null
    };

    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Profile created successfully!');
    window.location.href = 'login.html'; // Redirect to login page after successful registration
}

function showEligibleDonors(containerId = 'eligibleDonors') {
    const bloodGroupFilter = document.getElementById(containerId === 'eligibleDonors' ? 'bloodGroupFilter' : 'bloodGroupFilter2');
    const selectedBloodGroup = bloodGroupFilter.value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Filter eligible donors by blood group, age, weight, and last donation date
    const eligibleDonors = users.filter(user => {
        const minAge = 18;
        const minWeight = 50;
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // Check if user meets blood group, age, and weight criteria
        const isEligible = user.bloodGroup === selectedBloodGroup &&
                           user.age >= minAge &&
                           user.weight >= minWeight;

        // Check if user hasn't donated in the last 6 months
        const lastDonationDate = new Date(user.lastDonationDate);
        const canDonate = !user.lastDonationDate || lastDonationDate <= sixMonthsAgo;

        return isEligible && canDonate;
    });

    const eligibleDonorsContainer = document.getElementById(containerId);
    eligibleDonorsContainer.innerHTML = ''; // Clear previous results

    if (eligibleDonors.length > 0) {
        eligibleDonors.forEach(donor => {
            const donorInfo = document.createElement('p');
            donorInfo.textContent = `Name: ${donor.name}, Phone: ${donor.phoneNumber}`;
            eligibleDonorsContainer.appendChild(donorInfo);
        });
    } else {
        eligibleDonorsContainer.innerHTML = '<p>No eligible donors found for this blood group.</p>';
    }
}

function loadProfileData() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user) {
        document.getElementById("profileName").textContent = user.name;
        document.getElementById("profileEmail").textContent = user.email;
        document.getElementById("profilePhoneNumber").textContent = user.phoneNumber;
        document.getElementById("profileBloodGroup").textContent = user.bloodGroup;
        document.getElementById("profileAdmissionNumber").textContent = user.admissionNumber;
        document.getElementById("profileYearOfPassout").textContent = user.yearOfPassout;
        document.getElementById("profileStream").textContent = user.stream;
        document.getElementById("profileAge").textContent = user.age;
        document.getElementById("profileWeight").textContent = user.weight;

        // Set last donation date if it exists
        if (user.lastDonationDate) {
            document.getElementById("lastDonationDate").textContent = user.lastDonationDate;
        }
    }
}

// Function to update the last donation date
function updateLastDonationDate() {
    const newDonationDate = document.getElementById("lastDonationDateUpdate").value; // Updated to get value from correct input
    const user = JSON.parse(localStorage.getItem('loggedInUser')); // Get the currently logged-in user
    if (newDonationDate) {
        user.lastDonationDate = newDonationDate; // Update the last donation date
        localStorage.setItem('loggedInUser', JSON.stringify(user)); // Save updated user info
        document.getElementById("lastDonationDate").textContent = newDonationDate; // Update displayed date
    }
}

// Load profile data on page load
window.onload = loadProfileData; // This should load the profile for the logged-in user



function handleLogin(event) {
    event.preventDefault();
    const admissionNumber = document.getElementById('loginAdmissionNumber').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.admissionNumber === admissionNumber && u.password === password);
    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user)); // Save the logged-in user's data
        window.location.href = 'index2.html'; // Redirect to profile page
    } else {
        document.getElementById('loginError').innerText = 'Invalid admission number or password.';
    }
}


function checkEligibility(event) {
    event.preventDefault();
    const age = parseInt(document.getElementById('eligibilityAge').value);
    const weight = parseInt(document.getElementById('eligibilityWeight').value);
    const donatedBlood = document.getElementById('donatedBlood').checked;
    const lastDonationDate = new Date(document.getElementById('lastDonationDate').value);
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

    let resultMessage = '';

    if (age < 18 || weight < 50) {
        resultMessage = 'You are not eligible to donate blood.';
    } else if (donatedBlood && lastDonationDate > sixMonthsAgo) {
        resultMessage = 'You cannot donate blood as you have donated in the last 6 months.';
    } else {
        resultMessage = 'You are eligible to donate blood! Thank you for your willingness to help.';
    }

    document.getElementById('eligibilityResult').innerText = resultMessage;
}

function showEditForm() {
    document.getElementById('editProfileForm').style.display = 'block';
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user) {
        document.getElementById('editName').value = user.name;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editPhoneNumber').value = user.phoneNumber;
        document.getElementById('editBloodGroup').value = user.bloodGroup;
        document.getElementById('editAdmissionNumber').value = user.admissionNumber;
        document.getElementById('editYearOfPassout').value = user.yearOfPassout;
        document.getElementById('editStream').value = user.stream;
        document.getElementById('editAge').value = user.age;
        document.getElementById('editWeight').value = user.weight;
        document.getElementById('editLastDonationDate').value = user.lastDonationDate || '';
    }
}

function updateProfile(event) {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Update user properties with values from the form
    user.name = document.getElementById('editName').value;
    user.email = document.getElementById('editEmail').value;
    user.phoneNumber = document.getElementById('editPhoneNumber').value;
    user.bloodGroup = document.getElementById('editBloodGroup').value;
    user.admissionNumber = document.getElementById('editAdmissionNumber').value;
    user.yearOfPassout = document.getElementById('editYearOfPassout').value;
    user.stream = document.getElementById('editStream').value;
    user.age = parseInt(document.getElementById('editAge').value);
    user.weight = parseInt(document.getElementById('editWeight').value);
    user.lastDonationDate = document.getElementById('lastDonationDateUpdate').value;

    // Update the users array
    const userIndex = users.findIndex(u => u.admissionNumber === user.admissionNumber);
    if (userIndex > -1) {
        users[userIndex] = user; // Replace the old user data with the updated data
        localStorage.setItem('users', JSON.stringify(users)); // Save updated users array
    }

    localStorage.setItem('loggedInUser', JSON.stringify(user)); // Save updated user info
    loadProfileData(); // Refresh the displayed profile
    alert('Profile updated successfully!');
    document.getElementById('editProfileForm').style.display = 'none'; // Hide the edit form
}


function openProfile() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user) {
        document.getElementById('profileDetails').innerHTML = `
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone Number:</strong> ${user.phoneNumber}</p>
            <p><strong>Blood Group:</strong> ${user.bloodGroup}</p>
            <p><strong>Admission Number:</strong> ${user.admissionNumber}</p>
            <p><strong>Year of Passout:</strong> ${user.yearOfPassout}</p>
            <p><strong>Stream:</strong> ${user.stream}</p>
            <p><strong>Age:</strong> ${user.age}</p>
            <p><strong>Weight:</strong> ${user.weight} kg</p>
            <p><strong>Last Donation Date:</strong> ${user.lastDonationDate || 'N/A'}</p>
        `;
    }
}

function logout() {
    localStorage.removeItem('loggedInUser'); // Remove only the logged-in user's data
    window.location.href = 'index.html'; // Redirect to login page
}


function toggleLastDonationDate() {
    const checkbox = document.getElementById('donatedBlood');
    const dateField = document.getElementById('lastDonationDate');
    dateField.disabled = !checkbox.checked;
}
