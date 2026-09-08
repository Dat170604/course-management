console.log("Hello Word");
const title = document.querySelector("h1");
title.textContent = "My Website";
title.style.color = "blue";

const paragraph = document.createElement("p");
paragraph.textContent = "Nhanh tay";
document.querySelector(".hero").appendChild(paragraph);

const courses = [
    {
        name: "Math",
        describe: "Học toán"
    },
    {
        name:"Physic",
        describe: "Học lý"
    }
]

for (const course of courses) {
    const article = document.createElement("article");
    article.classList.add("course-card");

    const name = document.createElement("h3");
    name.textContent = course.name;

    const describe = document.createElement("p");
    describe.textContent = course.describe;

    const button = document.createElement("button");
    button.textContent = "View";

    article.append(name, describe, button);
    document.querySelector(".course-list").appendChild(article);
}