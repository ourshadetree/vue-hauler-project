<template>
    <div id="whyDifferentContainer">
        <div id="title">
            <h1>3. Technology-Driven Association</h1>
            <p>Streamline back-office reporting, automate dispatch, bypass brokers, and go direct-to-shippers by tapping into an advanced network built specifically for carriers.</p>
        </div>
        <div id="columns">
            <div id="left">
                <div id="leftGraphic">
                    <img src="../assets/chart.png" alt="chart">
                </div>
            </div>
            <div id="right">
                <div class="rightContent">
                    <h2>Current Focus</h2>
                    <p>Streamlining back-office reporting and automating routine procedures to make your trucking operations more efficient.</p>
                </div>
                <div class="rightContent">
                    <h2>What We Are Building</h2>
                    <p>Fully automated brokerage service built by truckers for truckers. Get loads directly from shippers without having to take a 20% pay cut to a broker.</p>
                </div>
            </div>
        </div>
        <div id="bottomVideo">
            <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/IGnvirW9ds8"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>

        </div>
        <button id="joinNowButton">Join Now</button>
    </div>
</template>

<script>

export default {
    name: 'WhyDifferentThree',
}

</script>

<style scoped>
#whyDifferentContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 0;
}

#columns {
    display: flex;
    flex-direction: row;
}

#left {
    flex: 1;
}

img {
    height: 60%;
    width: 60%;
}

#right {
    flex: 1;
}
</style>