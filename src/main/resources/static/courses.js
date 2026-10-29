// courses.js - Handles course loading and registration logic

// Resolve base API URL: If already running on Spring Boot (port 8081), use relative path;
// otherwise (IntelliJ preview port 63342, Live Server 5500, or file://), target http://localhost:8081
const BASE_URL = (window.location.port === "8081") ? "" : "http://localhost:8081";

// Cache of loaded courses
let availableCourses = [];

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");
    const coursesDropdown = document.getElementById("courses");
    const courseDetails = document.getElementById("courseDetails");
    const statusAlert = document.getElementById("statusAlert");
    const submitBtn = document.getElementById("submitBtn");

    // Load available courses on page load
    loadCourses();

    // Event: Show course details when a course is selected
    coursesDropdown.addEventListener("change", () => {
        const selectedCourseName = coursesDropdown.value;
        const selected = availableCourses.find(c => c.courseName === selectedCourseName);

        if (selected && courseDetails) {
            document.getElementById("detailCode").textContent = selected.courseId || "N/A";
            document.getElementById("detailTrainer").textContent = selected.trainer || "TBD";
            document.getElementById("detailDuration").textContent = selected.durationInWeeks ? `${selected.durationInWeeks} weeks` : "N/A";
            courseDetails.classList.remove("hidden");
        } else if (courseDetails) {
            courseDetails.classList.add("hidden");
        }
    });

    // Event: Handle form submission via AJAX
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Clear previous alerts
        hideAlert();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const courseName = coursesDropdown.value;

        // Basic Client-side Validation
        if (!name || !email || !courseName) {
            showAlert("Please fill in all required fields.", "error");
            return;
        }

        // Disable submit button and indicate loading state
        setSubmittingState(true);

        try {
            const formData = new URLSearchParams();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("courseName", courseName);

            const response = await fetch(`${BASE_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: formData
            });

            if (response.ok) {
                const message = await response.text();
                showAlert(message || `Registration successful for "${courseName}"!`, "success");
                form.reset();
                if (courseDetails) courseDetails.classList.add("hidden");
            } else {
                const errorText = await response.text();
                showAlert(`Registration failed: ${errorText || response.statusText}`, "error");
            }
        } catch (error) {
            console.error("Registration error:", error);
            showAlert("Unable to connect to server. Please ensure the backend application is running.", "error");
        } finally {
            setSubmittingState(false);
        }
    });

    /**
     * Fetch courses from backend and populate the select element
     */
    async function loadCourses() {
        coursesDropdown.innerHTML = '<option value="">Loading courses...</option>';
        coursesDropdown.disabled = true;

        try {
            const targetUrl = `${BASE_URL}/all`;
            console.log("Fetching courses from:", targetUrl);
            const response = await fetch(targetUrl);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            availableCourses = await response.json();
            coursesDropdown.innerHTML = '<option value="">-- Select a Course --</option>';

            if (!availableCourses || availableCourses.length === 0) {
                coursesDropdown.innerHTML = '<option value="">No courses available</option>';
                showAlert("No available courses were found in the system.", "info");
                return;
            }

            availableCourses.forEach(course => {
                const option = document.createElement("option");
                option.value = course.courseName;
                const durationText = course.durationInWeeks ? ` (${course.durationInWeeks} wks)` : "";
                option.textContent = `${course.courseName} - ${course.courseId}${durationText}`;
                coursesDropdown.appendChild(option);
            });

            coursesDropdown.disabled = false;

            // Pre-select course if specified in URL query params (?course=... or ?courseId=...)
            const urlParams = new URLSearchParams(window.location.search);
            const preselectCourse = urlParams.get("course") || urlParams.get("courseName");
            const preselectId = urlParams.get("courseId");

            if (preselectCourse) {
                const match = availableCourses.find(c => c.courseName.toLowerCase() === preselectCourse.toLowerCase());
                if (match) {
                    coursesDropdown.value = match.courseName;
                    coursesDropdown.dispatchEvent(new Event("change"));
                }
            } else if (preselectId) {
                const match = availableCourses.find(c => c.courseId.toLowerCase() === preselectId.toLowerCase());
                if (match) {
                    coursesDropdown.value = match.courseName;
                    coursesDropdown.dispatchEvent(new Event("change"));
                }
            }
        } catch (error) {
            console.error("Error loading courses:", error);
            coursesDropdown.innerHTML = '<option value="">Failed to load courses</option>';
            showAlert(`Failed to load courses from ${BASE_URL}/all. Check if backend is running on port 8081.`, "error");
        }
    }

    /**
     * Display status alert
     */
    function showAlert(message, type) {
        if (!statusAlert) return;
        statusAlert.textContent = message;
        statusAlert.className = `alert alert-${type}`;
        statusAlert.classList.remove("hidden");
    }

    /**
     * Hide status alert
     */
    function hideAlert() {
        if (!statusAlert) return;
        statusAlert.classList.add("hidden");
        statusAlert.textContent = "";
        statusAlert.className = "alert hidden";
    }

    /**
     * Toggle button submitting state
     */
    function setSubmittingState(isSubmitting) {
        if (!submitBtn) return;
        if (isSubmitting) {
            submitBtn.disabled = true;
            submitBtn.dataset.originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="spinner"></span> Registering...';
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalText || "Register Course";
        }
    }
});