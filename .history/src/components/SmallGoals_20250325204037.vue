<template>
    <div id="smallGoalContainer">
      <div id="left">
        <div id="threeGoalBoxes">
          <div id="goalBox1">
            <h3>Goal 1</h3>
            <div class="goalBox">
              <h2>15%</h2>
            </div>
            <p>Werner &amp; J.B Hunt</p>
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
          <div class="goalBar"></div>
          <div class="goalBar"></div>
          <div class="goalBar"></div>
          <button id="joinButton">Join The Movement</button>
        </div>
      </div>
      <div id="right">
        <div id="achieveList">
          <h3>What we will achieve</h3>
          <ul>
            <li>Lower Operating Expenses</li>
            <li>Reduce Reliance on Brokers</li>
            <li>Stabilize Industry Rates</li>
          </ul>
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
  /* Overall container */
  #smallGoalContainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    background-color: #073763;
    color: whitesmoke;
    padding: 40px;
    border-radius: 10px;
    margin-top: 50px;
  }
  
  /* Left and right sections */
  #left, #right {
    flex: 1;
    padding: 20px;
  }
  
  /* Goal Boxes */
  #threeGoalBoxes {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    margin-bottom: 30px;
  }
  
  #threeGoalBoxes > div {
    border: 2px solid whitesmoke;
    border-radius: 10px;
    padding: 15px;
    margin: 0 10px;
    text-align: center;
    flex: 1;
  }
  
  #threeGoalBoxes h3 {
    margin-bottom: 10px;
    font-size: 1.2rem;
  }
  
  .goalBox {
    border: 2px solid whitesmoke;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    margin: 0 auto 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
  }
  
  .goalBox h2 {
    margin: 0;
    font-size: 2rem;
    color: #073763;
  }
  
  /* Progress Bars */
  #threeGoalBars {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  
  .goalBar {
    width: 80%;
    height: 20px;
    background-color: whitesmoke;
    margin: 15px 0;
    border-radius: 10px;
    position: relative;
  }
  
  /* Using pseudo-elements for labels on the progress bars */
  .goalBar:nth-child(1)::before {
    content: "Goal 1";
    position: absolute;
    left: -110px;
    top: 50%;
    transform: translateY(-50%);
    font-weight: bold;
    color: whitesmoke;
  }
  .goalBar:nth-child(1)::after {
    content: "8000 trucks";
    position: absolute;
    right: -130px;
    top: 50%;
    transform: translateY(-50%);
    color: whitesmoke;
  }
  
  .goalBar:nth-child(2)::before {
    content: "Goal 2";
    position: absolute;
    left: -110px;
    top: 50%;
    transform: translateY(-50%);
    font-weight: bold;
    color: whitesmoke;
  }
  .goalBar:nth-child(2)::after {
    content: "10000 trucks";
    position: absolute;
    right: -130px;
    top: 50%;
    transform: translateY(-50%);
    color: whitesmoke;
  }
  
  .goalBar:nth-child(3)::before {
    content: "Goal 3";
    position: absolute;
    left: -110px;
    top: 50%;
    transform: translateY(-50%);
    font-weight: bold;
    color: whitesmoke;
  }
  .goalBar:nth-child(3)::after {
    content: "20000 trucks";
    position: absolute;
    right: -130px;
    top: 50%;
    transform: translateY(-50%);
    color: whitesmoke;
  }
  
  /* Join Button */
  #joinButton {
    background-color: whitesmoke;
    color: #073763;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 20px;
    transition: background-color 0.3s, transform 0.3s;
  }
  
  #joinButton:hover {
    background-color: #f0f0f0;
    transform: scale(1.05);
  }
  
  /* Achieve List (Right Side) */
  #achieveList {
    padding: 20px;
  }
  
  #achieveList h3 {
    margin-bottom: 15px;
  }
  
  #achieveList ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  #achieveList li {
    margin-bottom: 10px;
    position: relative;
    padding-left: 25px;
  }
  
  /* Add check mark icons */
  #achieveList li::before {
    content: "\2713";  /* Unicode for check mark */
    position: absolute;
    left: 0;
    top: 0;
    color: whitesmoke;
  }
  </style>
  