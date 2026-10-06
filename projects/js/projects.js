"use strict";

const projects = document.querySelectorAll(".project");


projects.forEach(function (project) {
    const button = project.querySelector(".project-summary");

    button.addEventListener("click", function () {
        const isOpen = project.classList.contains("open");

        projects.forEach(function (item) {
            item.classList.remove("open");

            const itemButton =
                item.querySelector(".project-summary");

            itemButton.setAttribute(
                "aria-expanded",
                "false"
            );
        });

        if (!isOpen) {
            project.classList.add("open");

            button.setAttribute(
                "aria-expanded",
                "true"
            );
        }
    });
});
