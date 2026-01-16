const API_URL = 'http://localhost:8080/api/students';

// Load all students when page loads
window.onload = function() {
    loadStudents();
};

// Load all students
function loadStudents() {
    fetch(API_URL)
        .then(response => response.json())
        .then(students => {
            displayStudents(students);
        })
        .catch(error => {
            showError('Error loading students: ' + error);
            document.getElementById('studentsBody').innerHTML =
                '<tr><td colspan="6" class="empty-state">Error loading students</td></tr>';
        });
}

// Display students in table
function displayStudents(students) {
    const tbody = document.getElementById('studentsBody');

    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No students found. Add one above!</td></tr>';
        return;
    }

    tbody.innerHTML = students.map(student => `
        <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.department || '-'}</td>
            <td>${student.yearOfEnrollment || '-'}</td>
            <td>
                <button class="btn-edit" onclick='editStudent(${JSON.stringify(student)})'>Edit</button>
                <button class="btn-delete" onclick="deleteStudent(${student.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Handle form submission (Add or Update)
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('studentForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const id = document.getElementById('studentId').value;
        const student = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            department: document.getElementById('department').value || null,
            yearOfEnrollment: parseInt(document.getElementById('yearOfEnrollment').value) || null
        };

        if (id) {
            updateStudent(id, student);
        } else {
            addStudent(student);
        }
    });
});

// Add new student
function addStudent(student) {
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add student');
        }
        return response.json();
    })
    .then(data => {
        showSuccess('Student added successfully!');
        resetForm();
        loadStudents();
    })
    .catch(error => {
        showError('Error adding student: ' + error.message);
    });
}

// Update student
function updateStudent(id, student) {
    fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update student');
        }
        return response.json();
    })
    .then(data => {
        showSuccess('Student updated successfully!');
        resetForm();
        loadStudents();
    })
    .catch(error => {
        showError('Error updating student: ' + error.message);
    });
}

// Edit student (populate form)
function editStudent(student) {
    document.getElementById('studentId').value = student.id;
    document.getElementById('name').value = student.name;
    document.getElementById('email').value = student.email;
    document.getElementById('department').value = student.department || '';
    document.getElementById('yearOfEnrollment').value = student.yearOfEnrollment || '';
    document.getElementById('formTitle').textContent = 'Edit Student';
    document.getElementById('submitBtn').textContent = 'Update Student';
    document.getElementById('cancelBtn').style.display = 'inline-block';

    // Scroll to form
    document.getElementById('studentForm').scrollIntoView({ behavior: 'smooth' });
}

// Delete student
function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete student');
            }
            showSuccess('Student deleted successfully!');
            loadStudents();
        })
        .catch(error => {
            showError('Error deleting student: ' + error.message);
        });
    }
}

// Cancel edit
function cancelEdit() {
    resetForm();
}

// Reset form
function resetForm() {
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
    document.getElementById('formTitle').textContent = 'Add New Student';
    document.getElementById('submitBtn').textContent = 'Add Student';
    document.getElementById('cancelBtn').style.display = 'none';
}

// Show success message
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}