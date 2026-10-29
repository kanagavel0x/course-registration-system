// available-courses.js - Handles displaying, filtering, and adding available courses

const BASE_URL = (window.location.port === "8081") ? "" : "http://localhost:8081";

let allCourses = [];

document.addEventListener("DOMContentLoaded", () => {
    const coursesGrid = document.getElementById("coursesGrid");
    const courseCount = document.getElementById("courseCount");
    const searchInput = document.getElementById("searchInput");
    const statusAlert = document.getElementById("statusAlert");
    const addCourseModal = document.getElementById("addCourseModal");
    const openAddModalBtn = document.getElementById("openAddModalBtn");
    const closeAddModalBtn = document.getElementById("closeAddModalBtn");
    const addCourseForm = document.getElementById("addCourseForm");
    const submitAddBtn = document.getElementById("submitAddBtn");

    loadCourses();

    // Search filter
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.toLowerCase().trim();
            const filtered = allCourses.filter(c => 
                (c.courseName && c.courseName.toLowerCase().includes(query)) ||
                (c.courseId && c.courseId.toLowerCase().includes(query)) ||
                (c.trainer && c.trainer.toLowerCase().includes(query))
            );
            renderCourses(filtered);
        });
    }

    // Modal controls
    if (openAddModalBtn && addCourseModal) {
        openAddModalBtn.addEventListener("click", () => {
            addCourseModal.classList.remove("hidden");
        });
    }
    if (closeAddModalBtn && addCourseModal) {
        closeAddModalBtn.addEventListener("click", () => {
            addCourseModal.classList.add("hidden");
        });
    }

    // Close modal on click outside content
    window.addEventListener("click", (e) => {
        if (e.target === addCourseModal) {
            addCourseModal.classList.add("hidden");
        }
    });

    // Add Course form submission
    if (addCourseForm) {
        addCourseForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const courseId = document.getElementById("newCourseId").value.trim();
            const courseName = document.getElementById("newCourseName").value.trim();
            const trainer = document.getElementById("newTrainer").value.trim();
            const durationInWeeks = parseInt(document.getElementById("newDuration").value.trim(), 10);

            if (!courseId || !courseName || !trainer || isNaN(durationInWeeks)) {
                showAlert("Please provide valid information for all course fields.", "error");
                return;
            }

            if (submitAddBtn) {
                submitAddBtn.disabled = true;
                submitAddBtn.innerHTML = '<span class="spinner"></span> Adding...';
            }

            try {
                const response = await fetch(`${BASE_URL}/add`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ courseId, courseName, trainer, durationInWeeks })
                });

                if (response.ok) {
                    showAlert(`Course "${courseName}" added successfully!`, "success");
                    addCourseForm.reset();
                    if (addCourseModal) addCourseModal.classList.add("hidden");
                    await loadCourses();
                } else {
                    const err = await response.text();
                    showAlert(`Failed to add course: ${err || response.statusText}`, "error");
                }
            } catch (err) {
                console.error("Error adding course:", err);
                showAlert("Network error. Please make sure backend is running.", "error");
            } finally {
                if (submitAddBtn) {
                    submitAddBtn.disabled = false;
                    submitAddBtn.textContent = "Add Course";
                }
            }
        });
    }

    async function loadCourses() {
        if (!coursesGrid) return;
        coursesGrid.innerHTML = '<div class="loading-state"><span class="spinner-blue"></span> Loading available courses...</div>';

        try {
            const response = await fetch(`${BASE_URL}/all`);
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

            allCourses = await response.json();
            renderCourses(allCourses);
        } catch (error) {
            console.error("Error fetching courses:", error);
            coursesGrid.innerHTML = `
                <div class="empty-state">
                    <p>Failed to load courses from backend.</p>
                    <button class="btn btn-primary" onclick="window.location.reload()">Retry</button>
                </div>`;
            showAlert("Failed to load courses. Please check if the server is running on port 8081.", "error");
        }
    }

    function renderCourses(courses) {
        if (courseCount) courseCount.textContent = courses.length;

        if (!courses || courses.length === 0) {
            coursesGrid.innerHTML = `
                <div class="empty-state">
                    <p>No courses found.</p>
                </div>`;
            return;
        }

        coursesGrid.innerHTML = courses.map(course => `
            <article class="course-card">
                <div class="course-card-header">
                    <span class="course-code-badge">${escapeHtml(course.courseId || "N/A")}</span>
                    <span class="course-duration-badge">${course.durationInWeeks ? course.durationInWeeks + ' Weeks' : 'TBD'}</span>
                </div>
                <h2 class="course-title">${escapeHtml(course.courseName || "Untitled Course")}</h2>
                <div class="course-instructor">
                    <span class="instructor-icon">👤</span>
                    <span>Trainer: <strong>${escapeHtml(course.trainer || "TBD")}</strong></span>
                </div>
                <div class="course-card-footer">
                    <a href="registration.html?course=${encodeURIComponent(course.courseName || '')}" class="btn btn-primary btn-block">
                        Register Now →
                    </a>
                </div>
            </article>
        `).join("");
    }

    function showAlert(message, type) {
        if (!statusAlert) return;
        statusAlert.textContent = message;
        statusAlert.className = `alert alert-${type}`;
        statusAlert.classList.remove("hidden");
        setTimeout(() => {
            statusAlert.classList.add("hidden");
        }, 5000);
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
