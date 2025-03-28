<template>
    <div id="roadmapContainer">
        <div id="title">
            <h1>Roadmap: The Long Haul</h1>
        </div>
        <div id="phaseBoxes">
            <div class="phaseBox">
                <h2>Phase 1</h2>
                <p>Build the network</p>
            </div>
            <div class="phaseBox">
                <h2>Phase 2</h2>
                <p>Automate dispatch</p>
            </div>
            <div class="phaseBox">
                <h2>Phase 3</h2>
                <p>Automate back-office reporting</p>
            </div>
            <div class="phaseBox">
                <h2>Phase 4</h2>
                <p>Go direct-to-shipper</p>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'RoadmapVision',
}

</script>

<style scoped>
#roadmapContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 0;
}
</style>