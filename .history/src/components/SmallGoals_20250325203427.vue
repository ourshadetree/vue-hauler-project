<template>
    <div id="smallGoalContainer">
        <div id="left">
            <div id="threeGoalBoxes">
                <div id="goalBox1">
                    <h3>Goal 1</h3>
                    <div class="goalBox">
                        <h2>15%</h2>
                    </div>
                    <p>Werner & J.B Hunt</p>
                </div>
                <div id="goalBox2">
                    <h3>Goal 2</h3>
                    <div class="goalBox">
                        <h2>10%</h2>
                    </div>
                    <p>Schneider</p>
                </div>
                <div id="goalBox3">
                    <h3>Goal 3</h3>
                    <div class="goalBox">
                        <h2>5%</h2>
                    </div>
                    <p>Knight-Swift</p>
                </div>
            </div>
            <div id="threeGoalBars">
                <div class="goalBar">
                    
                </div>
                <div class="goalBar">

                </div>
                <div class="goalBar">

                </div>
                <button id="joinButton">Join The Movement</button>
            </div>
        
        </div>
        <div id="right">
            <div id="achieveList">
                <ul>What we will achieve</ul>
                    <li>Lower Operating Expenses</li>
                    <li>Reduce Reliance on Brokers</li>
                    <li>Stabilizing Industry Rates</li>
            </div>
        </div>
    </div>
    
</template>

<script>

export default {
    name: "SmallGoals"

    
}
</script>

<style scoped>
#smallGoalContainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
}

#threeGoalBoxes {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

#threeGoalBars {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

</style>