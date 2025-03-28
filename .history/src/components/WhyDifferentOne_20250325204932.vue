<template>
    <div id="differentContainer">
        <div id="title">
            <h1>1. Collective Bargaining Approach</h1>
            <p>By becoming a Haulers United member you unlock the buying power of thousands of trucks with no volume minimums. As our collective purchasing volume grows, so does the group discount which is passed back to you, the carrier.</p>
        </div>
        <div id="columns">
            <div id="left">
                <h3>Diesel Cost Breakdown</h3>
                <p>By coming together and negotiating volume discounts with distributors, we can lower our fuel costs as much as possible</p>
                <div id="withoutUs">
                    <h4>Without Haulers United</h4>
                    <div id="withoutGraphic">

                    </div>
                </div>
                <div id="withUs">
                    <h4>With Haulers United</h4>
                    <div id="withGraphic">

                    </div>
                </div>
                <div id="disclaimer">
                    <p>Disclaimer: The above graphics are for illustrative purposes only and do not represent actual savings. Actual savings will vary based on market conditions and other factors.</p>
                </div>
            </div>
            <div id="right">
                <h2>Our Fuel Partners</h2>
                <div id="icons">

                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'WhyDifferentOne',
}

</script>

<style scoped>
#differentContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 0;
}
</style>