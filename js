/* =========================================
   CAMPUSIQ APPLICATION
   ========================================= */


/* =========================================
   GLOBAL HELPERS
   ========================================= */

function getTickets() {

    try {

        return JSON.parse(
            localStorage.getItem("campusTickets")
        ) || [];

    } catch (error) {

        console.error("Ticket storage error:", error);

        return [];
    }
}


function saveTickets(tickets) {

    localStorage.setItem(
        "campusTickets",
        JSON.stringify(tickets)
    );
}


function getCurrentRole() {

    return localStorage.getItem("campusRole");
}


function getCurrentUser() {

    return localStorage.getItem("campusUser");
}


/* =========================================
   TICKET ID
   ========================================= */

function generateTicketId() {

    return "CI-" +
        Math.floor(
            1000 + Math.random() * 9000
        );
}


/* =========================================
   PAGE NAVIGATION
   ========================================= */

function showPage(pageId) {

    const role = getCurrentRole();

    if (!role) {
        return;
    }


    const pages = [

        "studentPortal",
        "adminPortal",
        "report",
        "track",
        "admin"

    ];


    pages.forEach(function(id) {

        const page =
            document.getElementById(id);

        if (page) {
            page.hidden = true;
        }

    });


    const target =
        document.getElementById(pageId);

    if (!target) {
        console.error(
            "Page not found:",
            pageId
        );

        return;
    }


    /*
       Security:
       Student cannot access admin.
    */

    if (
        pageId === "admin" &&
        role !== "admin"
    ) {

        alert("Admin access only.");

        return;
    }


    target.hidden = false;


    if (pageId === "studentPortal") {

        updateStudentStats();
        renderStudentTickets();

    }


    if (pageId === "admin") {

        renderTickets();

    }
}


/* =========================================
   LOGIN
   ========================================= */

function loginUser(event) {

    if (event) {
        event.preventDefault();
    }


    const email =
        document.getElementById("loginEmail")
        .value
        .trim()
        .toLowerCase();


    const password =
        document.getElementById("loginPassword")
        .value;


    const message =
        document.getElementById("loginMessage");


    message.className = "login-message";


    /*
       STUDENT LOGIN
    */

    if (
        email === "student@campusiq.com" &&
        password === "student123"
    ) {

        localStorage.setItem(
            "campusRole",
            "student"
        );

        localStorage.setItem(
            "campusUser",
            email
        );


        message.textContent =
            "ACCESS GRANTED — ENTERING STUDENT PORTAL";


        message.classList.add("success");


        setTimeout(function() {

            openStudentPortal();

        }, 250);


        return;
    }


    /*
       ADMIN LOGIN
    */

    if (
        email === "admin@campusiq.com" &&
        password === "admin123"
    ) {

        localStorage.setItem(
            "campusRole",
            "admin"
        );

        localStorage.setItem(
            "campusUser",
            email
        );


        message.textContent =
            "ACCESS GRANTED — ENTERING COMMAND CENTER";


        message.classList.add("success");


        setTimeout(function() {

            openAdminPortal();

        }, 250);


        return;
    }


    /*
       INVALID LOGIN
    */

    message.textContent =
        "ACCESS DENIED — INVALID EMAIL OR PASSWORD";


    document.getElementById(
        "loginPassword"
    ).value = "";
}


/* =========================================
   STUDENT PORTAL
   ========================================= */

function openStudentPortal() {

    const role = getCurrentRole();


    if (role !== "student") {

        alert("Student access only.");

        return;
    }


    const loginPage =
        document.getElementById("loginPage");


    const app =
        document.getElementById("app");


    const adminButton =
        document.getElementById("adminNavButton");


    /*
       Make application visible
    */

    app.hidden = false;


    app.classList.remove(
        "app-slide-in"
    );


    /*
       Hide admin button
    */

    if (adminButton) {
        adminButton.style.display =
            "none";
    }


    /*
       Start login page swipe
    */

    loginPage.classList.add(
        "login-slide-out"
    );


    /*
       After animation
    */

    setTimeout(function() {

        loginPage.hidden = true;

        app.classList.add(
            "app-slide-in"
        );


        showPage(
            "studentPortal"
        );


        updateStudentStats();

        renderStudentTickets();

    }, 700);
}


/* =========================================
   ADMIN PORTAL
   ========================================= */

function openAdminPortal() {

    const role = getCurrentRole();


    if (role !== "admin") {

        alert("Admin access only.");

        return;
    }


    const loginPage =
        document.getElementById("loginPage");


    const app =
        document.getElementById("app");


    const adminButton =
        document.getElementById("adminNavButton");


    app.hidden = false;


    app.classList.remove(
        "app-slide-in"
    );


    /*
       Show admin navigation
    */

    if (adminButton) {

        adminButton.style.display =
            "inline-block";
    }


    /*
       Swipe login away
    */

    loginPage.classList.add(
        "login-slide-out"
    );


    setTimeout(function() {

        loginPage.hidden = true;

        app.classList.add(
            "app-slide-in"
        );


        showPage("admin");

        renderTickets();

    }, 700);
}


/* =========================================
   LOGOUT
   ========================================= */

function logoutUser() {

    localStorage.removeItem(
        "campusRole"
    );

    localStorage.removeItem(
        "campusUser"
    );


    const app =
        document.getElementById("app");


    const loginPage =
        document.getElementById("loginPage");


    app.classList.remove(
        "app-slide-in"
    );


    app.hidden = true;


    loginPage.hidden = false;

    loginPage.classList.remove(
        "login-slide-out"
    );


    document.getElementById(
        "loginEmail"
    ).value = "";


    document.getElementById(
        "loginPassword"
    ).value = "";


    document.getElementById(
        "loginMessage"
    ).textContent = "";


    document.getElementById(
        "loginMessage"
    ).className = "login-message";


    /*
       Return to login smoothly
    */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   BACK TO PORTAL
   ========================================= */

function goBackToPortal() {

    const role =
        getCurrentRole();


    if (role === "admin") {

        showPage("admin");

    } else {

        showPage("studentPortal");

    }
}


/* =========================================
   AI ANALYSIS
   ========================================= */

function getAIAnalysis(description) {

    const text =
        description
            .toLowerCase()
            .trim();


    /*
       NETWORK / IT
    */

    if (
        text.includes("wifi") ||
        text.includes("internet") ||
        text.includes("network") ||
        text.includes("computer") ||
        text.includes("login") ||
        text.includes("software") ||
        text.includes("portal")
    ) {

        return {

            category: "Network / IT Issue",

            department: "IT Department",

            priority: "MEDIUM",

            action:
                "IT team should diagnose network or system connectivity."
        };
    }


    /*
       PLUMBING
    */

    if (
        text.includes("water") ||
        text.includes("leak") ||
        text.includes("tap") ||
        text.includes("pipe") ||
        text.includes("toilet")
    ) {

        return {

            category: "Plumbing",

            department: "Maintenance",

            priority: "HIGH",

            action:
                "Maintenance team should inspect and repair the plumbing issue."
        };
    }


    /*
       ELECTRICAL
    */

    if (
        text.includes("electric") ||
        text.includes("electricity") ||
        text.includes("light") ||
        text.includes("fan") ||
        text.includes("power") ||
        text.includes("socket")
    ) {

        return {

            category: "Electrical",

            department: "Electrical Maintenance",

            priority: "HIGH",

            action:
                "Electrical team should inspect the power equipment immediately."
        };
    }


    /*
       CLASSROOM EQUIPMENT
    */

    if (
        text.includes("projector") ||
        text.includes("speaker") ||
        text.includes("smart board") ||
        text.includes("microphone") ||
        text.includes("mic")
    ) {

        return {

            category: "Classroom Equipment",

            department: "Technical Support",

            priority: "MEDIUM",

            action:
                "Technical support should inspect the classroom equipment."
        };
    }


    /*
       CLEANLINESS
    */

    if (
        text.includes("garbage") ||
        text.includes("dirty") ||
        text.includes("clean") ||
        text.includes("dust") ||
        text.includes("waste")
    ) {

        return {

            category: "Cleanliness",

            department: "Housekeeping",

            priority: "MEDIUM",

            action:
                "Housekeeping should inspect and clean the reported area."
        };
    }


    /*
       SAFETY
    */

    if (
        text.includes("fire") ||
        text.includes("smoke") ||
        text.includes("danger") ||
        text.includes("accident") ||
        text.includes("injury") ||
        text.includes("unsafe")
    ) {

        return {

            category: "Safety Issue",

            department: "Campus Safety",

            priority: "HIGH",

            action:
                "Campus Safety should investigate the issue immediately."
        };
    }


    /*
       DEFAULT
    */

    return {

        category: "General Maintenance",

        department: "Campus Operations",

        priority: "MEDIUM",

        action:
            "Campus Operations should inspect and route the issue."
    };
}


/* =========================================
   ANALYSE ISSUE BUTTON
   ========================================= */

function analyzeIssue() {

    const description =
        document.getElementById(
            "description"
        ).value.trim();


    if (!description) {

        alert(
            "Please describe the issue first."
        );

        return;
    }


    const analysis =
        getAIAnalysis(
            description
        );


    document.getElementById(
        "aiCategory"
    ).textContent =
        analysis.category;


    document.getElementById(
        "aiDepartment"
    ).textContent =
        analysis.department;


    document.getElementById(
        "aiPriority"
    ).textContent =
        analysis.priority;


    document.getElementById(
        "aiAction"
    ).textContent =
        analysis.action;
}


/* =========================================
   CREATE TICKET
   ========================================= */

function createTicket(event) {

    event.preventDefault();


    const studentName =
        document.getElementById(
            "studentName"
        ).value.trim();


    const location =
        document.getElementById(
            "location"
        ).value.trim();


    const category =
        document.getElementById(
            "category"
        ).value;


    const description =
        document.getElementById(
            "description"
        ).value.trim();


    if (
        !studentName ||
        !location ||
        !category ||
        !description
    ) {

        alert(
            "Please complete all fields."
        );

        return;
    }


    /*
       Intelligent analysis
    */

    const analysis =
        getAIAnalysis(
            description
        );


    /*
       Generate unique ID
    */

    const ticketId =
        generateTicketId();


    /*
       Get existing tickets
    */

    const tickets =
        getTickets();


    /*
       Create ticket
    */

    const ticket = {

        id: ticketId,

        studentName: studentName,

        email:
            getCurrentUser(),

        location: location,

        category: category,

        description: description,

        department:
            analysis.department,

        priority:
            analysis.priority,

        action:
            analysis.action,

        status: "Pending",

        createdAt:
            new Date().toLocaleString()

    };


    /*
       Save
    */

    tickets.push(ticket);

    saveTickets(tickets);


    /*
       Show AI result
    */

    document.getElementById(
        "aiCategory"
    ).textContent =
        analysis.category;


    document.getElementById(
        "aiDepartment"
    ).textContent =
        analysis.department;


    document.getElementById(
        "aiPriority"
    ).textContent =
        analysis.priority;


    document.getElementById(
        "aiAction"
    ).textContent =
        analysis.action;


    /*
       Success message
    */

    alert(
        "ISSUE REGISTERED!\n\n" +
        "Your Ticket ID is: " +
        ticketId
    );


    /*
       Reset form
    */

    document.getElementById(
        "ticketForm"
    ).reset();


    /*
       Reset AI panel
    */

    document.getElementById(
        "aiCategory"
    ).textContent = "—";


    document.getElementById(
        "aiDepartment"
    ).textContent = "—";


    document.getElementById(
        "aiPriority"
    ).textContent = "—";


    document.getElementById(
        "aiAction"
    ).textContent = "—";


    /*
       Update student dashboard
    */

    updateStudentStats();

    renderStudentTickets();


    /*
       Go back
    */

    setTimeout(function() {

        showPage(
            "studentPortal"
        );

    }, 300);
}


/* =========================================
   STUDENT STATS
   ========================================= */

function updateStudentStats() {

    const email =
        getCurrentUser();


    const tickets =
        getTickets();


    const myTickets =
        tickets.filter(
            function(ticket) {

                return ticket.email === email;

            }
        );


    const active =
        myTickets.filter(
            function(ticket) {

                return ticket.status !== "Resolved";

            }
        );


    const resolved =
        myTickets.filter(
            function(ticket) {

                return ticket.status === "Resolved";

            }
        );


    document.getElementById(
        "studentTotal"
    ).textContent =
        myTickets.length;


    document.getElementById(
        "studentActive"
    ).textContent =
        active.length;


    document.getElementById(
        "studentResolved"
    ).textContent =
        resolved.length;
}


/* =========================================
   STUDENT TICKETS
   ========================================= */

function renderStudentTickets() {

    const container =
        document.getElementById(
            "studentTicketList"
        );


    if (!container) {
        return;
    }


    const email =
        getCurrentUser();


    const tickets =
        getTickets().filter(
            function(ticket) {

                return ticket.email === email;

            }
        );


    if (tickets.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                No issues reported yet.
                <br><br>
                Click "REPORT ISSUE" to create your first ticket.
            </div>
        `;

        return;
    }


    /*
       Latest first
    */

    tickets.reverse();


    container.innerHTML =
        tickets.map(
            function(ticket) {

                return createTicketHTML(
                    ticket,
                    false
                );

            }
        ).join("");
}


/* =========================================
   TICKET HTML
   ========================================= */

function createTicketHTML(
    ticket,
    adminView
) {

    let priorityClass =
        "priority-medium";


    if (ticket.priority === "HIGH") {
        priorityClass =
            "priority-high";
    }


    if (ticket.priority === "LOW") {
        priorityClass =
            "priority-low";
    }


    let statusClass =
        "status-pending";


    if (ticket.status === "In Progress") {

        statusClass =
            "status-progress";

    }


    if (ticket.status === "Resolved") {

        statusClass =
            "status-resolved";

    }


    let pendingActive = "";

    let progressActive = "";

    let resolvedActive = "";


    if (
        ticket.status === "Pending"
    ) {

        pendingActive = "active";

    }


    if (
        ticket.status === "In Progress"
    ) {

        pendingActive = "active";

        progressActive = "active";

    }


    if (
        ticket.status === "Resolved"
    ) {

        pendingActive = "active";

        progressActive = "active";

        resolvedActive = "active";

    }


    let adminControls = "";


    if (adminView) {

        adminControls = `

            <div class="ticket-actions">

                <select
                    onchange="updateTicketStatus(
                        '${ticket.id}',
                        this.value
                    )">

                    <option value="Pending"
                        ${ticket.status === "Pending" ? "selected" : ""}>
                        Pending
                    </option>

                    <option value="In Progress"
                        ${ticket.status === "In Progress" ? "selected" : ""}>
                        In Progress
                    </option>

                    <option value="Resolved"
                        ${ticket.status === "Resolved" ? "selected" : ""}>
                        Resolved
                    </option>

                </select>

            </div>

        `;
    }


    return `

        <div class="ticket-card">

            <div class="ticket-top">

                <div class="ticket-id">
                    ${ticket.id}
                </div>

                <div class="badge ${statusClass}">
                    ${ticket.status}
                </div>

            </div>


            <div class="ticket-title">
                ${escapeHTML(ticket.category)}
            </div>


            <div class="ticket-description">
                ${escapeHTML(ticket.description)}
            </div>


            <div class="ticket-meta">

                <span class="badge">
                    📍 ${escapeHTML(ticket.location)}
                </span>

                <span class="badge">
                    ${escapeHTML(ticket.department)}
                </span>

                <span class="badge ${priorityClass}">
                    ${ticket.priority}
                </span>

                ${
                    adminView
                    ? `
                        <span class="badge">
                            👤 ${escapeHTML(ticket.studentName)}
                        </span>
                    `
                    : ""
                }

            </div>


            <div class="timeline">

                <div class="timeline-step ${pendingActive}">

                    <div class="timeline-dot"></div>

                    <span class="timeline-label">
                        REPORTED
                    </span>

                </div>


                <div class="timeline-line"></div>


                <div class="timeline-step ${progressActive}">

                    <div class="timeline-dot"></div>

                    <span class="timeline-label">
                        IN PROGRESS
                    </span>

                </div>


                <div class="timeline-line"></div>


                <div class="timeline-step ${resolvedActive}">

                    <div class="timeline-dot"></div>

                    <span class="timeline-label">
                        RESOLVED
                    </span>

                </div>

            </div>


            ${adminControls}


            <div style="
                margin-top:15px;
                color:#596479;
                font-size:9px;
                letter-spacing:1px;
            ">
                ${ticket.createdAt}
            </div>

        </div>

    `;
}


/* =========================================
   ADMIN DASHBOARD
   ========================================= */

function renderTickets() {

    const tickets =
        getTickets();


    /*
       Stats
    */

    const pending =
        tickets.filter(
            function(ticket) {

                return ticket.status === "Pending";

            }
        ).length;


    const progress =
        tickets.filter(
            function(ticket) {

                return ticket.status === "In Progress";

            }
        ).length;


    const resolved =
        tickets.filter(
            function(ticket) {

                return ticket.status === "Resolved";

            }
        ).length;


    document.getElementById(
        "totalCount"
    ).textContent =
        tickets.length;


    document.getElementById(
        "pendingCount"
    ).textContent =
        pending;


    document.getElementById(
        "progressCount"
    ).textContent =
        progress;


    document.getElementById(
        "resolvedCount"
    ).textContent =
        resolved;


    renderAdminTickets(
        tickets
    );
}


/* =========================================
   ADMIN TICKETS
   ========================================= */

function renderAdminTickets(
    tickets
) {

    const container =
        document.getElementById(
            "ticketList"
        );


    if (!container) {
        return;
    }


    if (tickets.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                No tickets match the current filters.

            </div>

        `;

        return;
    }


    tickets.reverse();


    container.innerHTML =
        tickets.map(
            function(ticket) {

                return createTicketHTML(
                    ticket,
                    true
                );

            }
        ).join("");
}


/* =========================================
   UPDATE STATUS
   ========================================= */

function updateTicketStatus(
    ticketId,
    newStatus
) {

    const tickets =
        getTickets();


    const ticket =
        tickets.find(
            function(item) {

                return item.id === ticketId;

            }
        );


    if (!ticket) {

        alert(
            "Ticket not found."
        );

        return;
    }


    ticket.status =
        newStatus;


    saveTickets(tickets);


    renderTickets();


    /*
       If student dashboard is open,
       update it too.
    */

    renderStudentTickets();

    updateStudentStats();
}


/* =========================================
   FILTER TICKETS
   ========================================= */

function filterTickets() {

    const status =
        document.getElementById(
            "statusFilter"
        ).value;


    const priority =
        document.getElementById(
            "priorityFilter"
        ).value;


    const department =
        document.getElementById(
            "departmentFilter"
        ).value;


    let tickets =
        getTickets();


    if (status !== "all") {

        tickets =
            tickets.filter(
                function(ticket) {

                    return ticket.status === status;

                }
            );
    }


    if (priority !== "all") {

        tickets =
            tickets.filter(
                function(ticket) {

                    return ticket.priority === priority;

                }
            );
    }


    if (department !== "all") {

        tickets =
            tickets.filter(
                function(ticket) {

                    return ticket.department === department;

                }
            );
    }


    renderAdminTickets(
        tickets
    );
}


/* =========================================
   TRACK TICKET
   ========================================= */

function trackTicket() {

    const id =
        document.getElementById(
            "trackTicketId"
        ).value
        .trim()
        .toUpperCase();


    const result =
        document.getElementById(
            "trackResult"
        );


    if (!id) {

        result.innerHTML = `

            <div class="empty-state">

                Enter a ticket ID.

            </div>

        `;

        return;
    }


    const ticket =
        getTickets().find(
            function(item) {

                return item.id.toUpperCase() === id;

            }
        );


    if (!ticket) {

        result.innerHTML = `

            <div class="ticket-card">

                <div class="ticket-title">
                    TICKET NOT FOUND
                </div>

                <div class="ticket-description">
                    No CampusIQ ticket was found with ID
                    <strong>${escapeHTML(id)}</strong>.
                </div>

            </div>

        `;

        return;
    }


    result.innerHTML =
        createTicketHTML(
            ticket,
            false
        );
}


/* =========================================
   SECURITY / HTML ESCAPE
   ========================================= */

function escapeHTML(value) {

    if (!value) {
        return "";
    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


/* =========================================
   INITIALIZATION
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /*
           LOGIN FORM
        */

        const loginForm =
            document.getElementById(
                "loginForm"
            );


        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                loginUser
            );

        }


        /*
           TICKET FORM
        */

        const ticketForm =
            document.getElementById(
                "ticketForm"
            );


        if (ticketForm) {

            ticketForm.addEventListener(
                "submit",
                createTicket
            );

        }


        /*
           FILTERS
        */

        const statusFilter =
            document.getElementById(
                "statusFilter"
            );


        const priorityFilter =
            document.getElementById(
                "priorityFilter"
            );


        const departmentFilter =
            document.getElementById(
                "departmentFilter"
            );


        if (statusFilter) {

            statusFilter.addEventListener(
                "change",
                filterTickets
            );

        }


        if (priorityFilter) {

            priorityFilter.addEventListener(
                "change",
                filterTickets
            );

        }


        if (departmentFilter) {

            departmentFilter.addEventListener(
                "change",
                filterTickets
            );

        }


        /*
           AUTO LOGIN
        */

        const role =
            getCurrentRole();


        if (role === "student") {

            openStudentPortal();

        }


        if (role === "admin") {

            openAdminPortal();

        }

    }
);
