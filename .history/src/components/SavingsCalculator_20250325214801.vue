<template>
    <div class="savings-calculator-container">
      <h2>Member Savings Calculator</h2>
  
      <!-- Number of Trucks Input -->
      <div class="input-section">
        <label for="truckCount">Number of Trucks:</label>
        <input
          id="truckCount"
          type="number"
          min="1"
          v-model="numTrucks"
        />
      </div>
  
      <!-- Calculate Button -->
      <button @click="calculateSavings">
        Calculate Savings
      </button>
  
      <!-- Separator -->
      <hr class="red-separator" />
  
      <!-- Estimated Savings -->
      <h3>Estimated Savings</h3>
      <div class="savings-display">
        <p>
          Monthly Savings:
          <span class="highlight">
            \${{ monthlySavings.toLocaleString() }}
          </span>
        </p>
        <p>
          Annual Savings:
          <span class="highlight">
            \${{ annualSavings.toLocaleString() }}
          </span>
        </p>
      </div>
  
      <!-- Breakdown -->
      <div class="breakdown">
        <p>
          <strong>Factoring Savings:</strong><br />
          \$15,000 revenue × 1.5% factoring savings × {{ numTrucks }} trucks
          = <span class="highlight">\${{ factoringSavings.toLocaleString() }}</span>
        </p>
        <p>
          <strong>Fuel Savings:</strong><br />
          1,200 gallons × \$0.70 average discount × {{ numTrucks }} trucks
          = <span class="highlight">\${{ fuelSavings.toLocaleString() }}</span>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SavingsCalculator',
  
    data() {
      return {
        // Reactive data properties
        numTrucks: 4,
        factoringSavings: 0,
        fuelSavings: 0,
        monthlySavings: 0,
        annualSavings: 0,
  
        // Base values used in the calculation
        baseMonthlyRevenue: 15000,   // per truck
        factoringRate: 0.015,       // 1.5%
        fuelGallonsPerMonth: 1200,  // per truck
        fuelDiscount: 0.70,         // $0.70 discount per gallon
      }
    },
  
    methods: {
      calculateSavings() {
        // Calculate factoring savings
        this.factoringSavings =
          this.baseMonthlyRevenue * this.factoringRate * this.numTrucks
  
        // Calculate fuel savings
        this.fuelSavings =
          this.fuelGallonsPerMonth * this.fuelDiscount * this.numTrucks
  
        // Total monthly savings
        this.monthlySavings = this.factoringSavings + this.fuelSavings
  
        // Annual savings
        this.annualSavings = this.monthlySavings * 12
      }
    },
  
    // Calculate once on mount
    mounted() {
      this.calculateSavings()
    }
  }
  </script>
  
  <style scoped>
  /* Container styling */
  .savings-calculator-container {
    max-width: 400px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    text-align: center;
    background-color: #fff;
    font-family: Arial, sans-serif;
  }
  
  /* Headings */
  .savings-calculator-container h2 {
    color: #be1e2d; /* bold red color */
    margin-bottom: 10px;
    font-size: 1.5rem;
  }
  
  .savings-calculator-container h3 {
    color: #be1e2d;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  
  /* Number of Trucks Section */
  .input-section {
    margin: 15px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .input-section label {
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .input-section input {
    width: 50%;
    padding: 5px;
    text-align: center;
    border: 1px solid #aaa;
    border-radius: 4px;
  }
  
  /* Calculate Button */
  button {
    background-color: #be1e2d;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 5px;
  }
  
  button:hover {
    background-color: #a71b27;
  }
  
  /* Red Separator */
  .red-separator {
    border: 0;
    height: 2px;
    background-color: #be1e2d;
    margin: 20px auto;
    width: 80%;
  }
  
  /* Savings Display */
  .savings-display p {
    font-size: 1.1rem;
    margin: 5px 0;
  }
  
  .highlight {
    color: #be1e2d;
    font-weight: bold;
  }
  
  /* Breakdown Section */
  .breakdown {
    margin-top: 20px;
    font-size: 0.95rem;
    text-align: left;
  }
  
  .breakdown p {
    margin-bottom: 15px;
  }
  </style>
  