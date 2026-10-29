// enrolled.js - Handles fetching, searching, and filtering student course enrollments

const BASE_URL = (window.location.port === "8081") ? "" : "http://localhost:8081";

let allEnrollments = [];

document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("enrolledTableBody");
    const enrollmentCount = document.getElementById("enrollmentCount");
    const searchInput = document.getElementById("searchInput");
    const courseFilter = document.getElementById("courseFilter");
    const refreshBtn = document.getElementById("refreshBtn");
    const statusAlert = document.getElementById("statusAlert");

    loadEnrollments();

    // Event: Refresh button
    if (refreshBtn) {
        refreshBtn.addEventListener("click", () => {
            loadEnrollments();
        });
    }

    // Event: Search input
    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
    }

    // Event: Course dropdown filter
    if (courseFilter) {
        courseFilter.addEventListener("change", applyFilters);
    }

    async function loadEnrollments() {
        if (!tableBody) return;
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-4">
                    <span class="spinner-blue"></span> Loading enrollment records...
                </td>
            </tr>`;

        try {
            const response = await fetch(`${BASE_URL}/enrolled`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            allEnrollments = await response.json();
            populateCourseFilter(allEnrollments);
            applyFilters();
        } catch (error) {
            console.error("Error loading enrolled students:", error);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-4 text-error">
                        Failed to load enrollment records. Make sure the backend server is running on port 8081.
                    </td>
                </tr>`;
            showAlert("Failed to load enrollment records from backend.", "error");
        }
    }

    function populateCourseFilter(enrollments) {
        if (!courseFilter) return;
        const currentVal = courseFilter.value;
        const uniqueCourses = [...new Set(enrollments.map(e => e.courseName).filter(Boolean))].sort();

        courseFilter.innerHTML = '<option value="">All Courses</option>';
        uniqueCourses.forEach(cName => {
            const opt = document.createElement("option");
            opt.value = cName;
            opt.textContent = cName;
            courseFilter.appendChild(opt);
        });

        if (uniqueCourses.includes(currentVal)) {
            courseFilter.value = currentVal;
        }
    }

    function applyFilters() {
        const query = (searchInput ? searchInput.value : "").toLowerCase().trim();
        const selectedCourse = courseFilter ? courseFilter.value : "";

        const filtered = allEnrollments.filter(item => {
            const matchesQuery = !query ||
                (item.name && item.name.toLowerCase().includes(query)) ||
                (item.email && item.email.toLowerCase().includes(query)) ||
                (item.courseName && item.courseName.toLowerCase().includes(query)) ||
                (item.id && String(item.id).includes(query));

            const matchesCourse = !selectedCourse || item.courseName === selectedCourse;

            return matchesQuery && matchesCourse;
        });

        renderTable(filtered);
    }

    function renderTable(enrollments) {
        if (enrollmentCount) {
            enrollmentCount.textContent = enrollments.length;
        }

        if (!enrollments || enrollments.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-4 text-muted">
                        No enrolled students found.
                    </td>
                </tr>`;
            return;
        }

        tableBody.innerHTML = enrollments.map(item => `
            <tr>
                <td><span class="id-badge">#${escapeHtml(item.id || "-")}</span></td>
                <td class="font-semibold">${escapeHtml(item.name || "Unknown")}</td>
                <td>
                    ${item.email ? `<a href="mailto:${escapeHtml(item.email)}" class="email-link">✉️ ${escapeHtml(item.email)}</a>` : "-"}
                </td>
                <td>
                    <span class="course-pill">${escapeHtml(item.courseName || "Not Specified")}</span>
                </td>
            </tr>
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
