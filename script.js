document.addEventListener('DOMContentLoaded', () => {
    fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json")
        .then(response => response.json())
        .then(data => {
            drawTreeMap(data)
        })
        .catch(err => console.error(err));
});

const drawTreeMap = (data) => {

    const hierarchy = d3.hierarchy(data, (node) => {
        return node.children
    }).sum((node) => {
        return node.value
    }).sort((node1, node2) => {
        return node2.value - node1.value
    })

    d3.select("body").append("h1").attr("id", "title").text("Video Game Sales");
    d3.select("body").append("p").attr("id", "description").text("Top 100 Most Sold Video Games Grouped by Platform");

    const width = 1000;
    const height = 600;

    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "canvas");

    const createTreeMap = d3.treemap().size([width, height]);
    createTreeMap(hierarchy);

    const container = d3.select("#canvas").selectAll("g")
        .data(hierarchy.leaves())
        .enter()
        .append("g")
        .attr("transform", (d) => {
            return `translate(${d.x0}, ${d.y0})`
        })

    container.append("rect")
        .attr("class", "tile")
        .attr("fill", (d) => {
            switch (d.data.category) {
                case "2600":
                    return "#d32f2f"; // Desaturated Red
                case "Wii":
                    return "#8bc34a"; // Desaturated Green
                case "NES":
                    return "#f7dc6f"; // Desaturated Yellow
                case "GB":
                    return "#ffb74d"; // Desaturated Orange
                case "DS":
                    return "#e4ce1f"; // Desaturated Pink
                case "X360":
                    return "#7986cb"; // Desaturated Indigo
                case "PS3":
                    return "#ba68c8"; // Desaturated Purple
                case "PS2":
                    return "#ffab00"; // Desaturated Deep Orange
                case "SNES":
                    return "#c5e1a5"; // Desaturated Lime
                case "GBA":
                    return "#b3e5fc"; // Desaturated Light Green
                case "PS4":
                    return "#64b5f6"; // Desaturated Blue
                case "3DS":
                    return "#4dd0e1"; // Desaturated Cyan
                case "N64":
                    return "#ffab00"; // Desaturated Deep Orange
                case "PS":
                    return "#0097a7"; // Desaturated Teal
                case "XB":
                    return "#87ceeb"; // Light Sky Blue
                case "PC":
                    return "#ffd54f"; // Desaturated Amber
                case "PSP":
                    return "#ff79a2"; // Desaturated Bright Pink
                case "XOne":
                    return "#7e57c2"; // Desaturated Dark Purple
                default:
                    return "#9e9e9e"; // Grey
            }
        })
        .attr("data-name", (d) => {
            return d.data.name
        })
        .attr("data-category", (d) => {
            return d.data.category
        })
        .attr("data-value", (d) => {
            return d.data.value
        })
        .attr("width", (d) => {
            return d.x1 - d.x0
        })
        .attr("height", (d) => {
            return d.y1 - d.y0
        })
        .attr("stroke", "#fff")
        .on("mouseover", (event, d) => {
            const name = d.data.name;
            const category = d.data.category;
            const value = d.data.value;
            const x = event.clientX + 10;
            const y = event.clientY + 10;
            tooltip
                .style("display", "block")
                .style("left", `${x}px`)
                .style("top", `${y}px`)
                .html(`Name: ${name}<br/>Category: ${category}<br/>Value: ${value}`)
        })
        .on("mouseout", () => {
            tooltip
                .style("display", "none")
        })

    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")

    container.append("foreignObject")
        .attr("x", 1)
        .attr("y", 0)
        .attr("width", (d) => {
            return d.x1 - d.x0
        })
        .attr("height", (d) => {
            return d.y1 - d.y0
        })
        .attr("pointer-events", "none")
        .append("xhtml:div")
        .style("font-size", "10px")
        .style("pointer-events", "none")
        .style("user-select", "none")
        .html((d) => {
            return d.data.name;
        })

    const consolePlatforms = [
        { category: "2600", color: "#d32f2f" },
        { category: "Wii", color: "#8bc34a" },
        { category: "NES", color: "#f7dc6f" },
        { category: "GB", color: "#ffb74d" },
        { category: "DS", color: "#e4ce1f" },
        { category: "X360", color: "#7986cb" },
        { category: "PS3", color: "#ba68c8" },
        { category: "PS2", color: "#ffab00" },
        { category: "SNES", color: "#c5e1a5" },
        { category: "GBA", color: "#b3e5fc" },
        { category: "PS4", color: "#64b5f6" },
        { category: "3DS", color: "#4dd0e1" },
        { category: "N64", color: "#ffab00" },
        { category: "PS", color: "#0097a7" },
        { category: "XB", color: "#87ceeb" },
        { category: "PC", color: "#ffd54f" },
        { category: "PSP", color: "#ff79a2" },
        { category: "XOne", color: "#7e57c2" },
    ];

    const legend = d3.select("body")
        .append("svg")
        .attr("width", 365)
        .attr("height", 200)
        .attr("id", "legend");

    const legendItems = consolePlatforms.reduce((acc, item, index) => {
        const columnIndex = Math.floor(index / 6);
        if (!acc[columnIndex]) {
            acc[columnIndex] = [];
        }
        acc[columnIndex].push(item);
        return acc;
    }, []);

    const legendRow = legend.selectAll("g")
        .data(legendItems)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(${i * 150}, 0)`);

    legendRow.selectAll("rect")
        .data((d) => d)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => i * 22)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", (d) => d.color);

    legendRow.selectAll("text")
        .data((d) => d)
        .enter()
        .append("text")
        .attr("x", 25)
        .attr("y", (d, i) => i * 22 + 15)
        .text((d) => d.category);
}





