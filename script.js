// Set up SVG canvas with padding
const svg = d3.select("#svgCanvas")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight);

// Define padding and circle properties
const padding = 30; // Padding between circles and edge of the screen
const circleRadius = 10;  // Radius of the circles (uniform size)

// Function to create the grid of circles
function createGrid() {
    // Calculate number of columns and rows based on the screen size and padding
    const cols = Math.floor((window.innerWidth - padding) / (circleRadius * 2 + padding));
    const rows = Math.floor((window.innerHeight - padding) / (circleRadius * 2 + padding));

    // Remove previous circles before redrawing
    svg.selectAll("circle").remove();

    // Create new circles with padding around the edges, in a regular grid
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            svg.append("circle")
                .attr("cx", col * (circleRadius * 2 + padding) + circleRadius + padding)  // X position with padding
                .attr("cy", row * (circleRadius * 2 + padding) + circleRadius + padding)  // Y position with padding
                .attr("r", circleRadius)  // Circle radius
                .attr("fill", "rgba(147, 207, 192, 0.5)")  // Initial fill color with 50% transparency
                .attr("class", "circle")
                .on("mouseover", function () {
                    anime({
                        targets: this,
                        scale: [1, 1.8],
                        rotate: '45deg',
                        fill: 'rgba(227, 255, 248, 0.7)',  // Hover color with some transparency
                        easing: 'easeInOutQuad',
                        duration: 500
                    });
                })
                .on("mouseout", function () {
                    anime({
                        targets: this,
                        scale: 1,
                        rotate: '0deg',
                        fill: 'rgba(147, 207, 192, 0.5)',  // Return to original color with transparency
                        easing: 'easeInOutQuad',
                        duration: 500
                    });
                })
                .on("click", function () {
                    anime({
                        targets: this,
                        r: [circleRadius, circleRadius * 2, circleRadius],  // Pulsing effect
                        fill: 'rgba(199, 237, 228, 0.8)',  // Clicked color with transparency
                        easing: 'easeInOutQuad',
                        duration: 700
                    });

                    // Trigger a ripple effect around the clicked circle
                    const circleX = +d3.select(this).attr("cx");
                    const circleY = +d3.select(this).attr("cy");

                    svg.selectAll("circle").each(function(d) {
                        const distX = Math.abs(circleX - +d3.select(this).attr("cx"));
                        const distY = Math.abs(circleY - +d3.select(this).attr("cy"));
                        const distance = Math.sqrt(distX * distX + distY * distY);
                        
                        // Scale the circles that are closer to the clicked one
                        if (distance < 100) {
                            d3.select(this)
                                .transition().duration(500)
                                .attr("r", circleRadius * 1.5)
                                .attr("fill", 'rgba(227, 255, 248, 0.7)');
                        }
                    });
                });
        }
    }

    // Add a meaningful quote about connection and flow
    svg.append("text")
        .attr("x", window.innerWidth / 2)
        .attr("y", window.innerHeight / 2.3)
        .attr("text-anchor", "left")
        .attr("font-family", "Inter, sans-serif")
        .attr("font-size", "20px")
        .attr("fill", "rgba(255, 255, 255, 0.8)")
        .text("Where every point touches, a new path begins.");

    // Add a small message about the interconnectedness of the circles
    svg.append("text")
        .attr("x", window.innerWidth / 2)
        .attr("y", window.innerHeight / 2)
        .attr("text-anchor", "left")
        .attr("font-family", "Inter, sans-serif")
        .attr("font-size", "20px")
        .attr("fill", "rgba(255, 255, 255, 0.6)")
        .text("We move together, forever intertwined.");
}

// Handle mousemove event to make circles react to the cursor
document.addEventListener("mousemove", function(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    svg.selectAll("circle").each(function(d) {
        const circle = d3.select(this);
        const circleX = +circle.attr("cx");
        const circleY = +circle.attr("cy");

        const distX = mouseX - circleX;
        const distY = mouseY - circleY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        const scaleFactor = Math.min(2, 1 + (100 / distance));  // Scale circles based on distance
        const maxScale = 1.8;  // Max scale
        circle.transition().duration(100).ease(d3.easeCircleInOut)
            .attr("r", Math.min(circle.attr("r") * scaleFactor, maxScale * circleRadius))
            .attr("fill", d3.interpolateRgb("rgba(147, 207, 192, 0.5)", "rgba(227, 255, 248, 0.7)")(scaleFactor - 1)); // Smooth fill color transition
    });
});

// Initial grid creation
createGrid();

// Responsive adjustments for resizing the window
window.addEventListener('resize', () => {
    svg.attr("width", window.innerWidth)
       .attr("height", window.innerHeight);

    // Recreate the grid with the updated window size
    createGrid();
});
