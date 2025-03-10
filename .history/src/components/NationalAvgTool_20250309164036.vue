<template>
    <div>
        <button class="toolButton" @click="fetchNationalAverage">Press for National Average</button>
        <p v-if="averagePrice !== null">Average Retail Price: {{ averagePrice }}</p>
    </div>
</template>

<script>
import { ref } from 'vue';
import { supabase } from '@/supabaseClient';  // ✅ Ensure correct import path

export default {
    name: "NationalAverageTool",

    setup() {
        const averagePrice = ref(null);

        async function fetchNationalAverage() {
            console.log("Fetching average Retail Price...");

            try {
                const { data, error } = await supabase
                    .from('caseyFuelData') // ✅ Correct table name
                    .select('Retail Price'); // ✅ Ensure column name is correct

                if (error) {
                    console.error('Error fetching data:', error);
                    return;
                }

                if (data.length > 0) {
                    // ✅ Calculate the average of "Retail Price"
                    const sum = data.reduce((acc, row) => acc + row["Retail Price"], 0);
                    const avg = sum / data.length;

                    averagePrice.value = avg.toFixed(2); // ✅ Round to 2 decimal places
                    console.log("Average Retail Price:", avg);
                } else {
                    console.log('No data found');
                    averagePrice.value = "No data available";
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        return {
            averagePrice,
            fetchNationalAverage
        };
    }
}
</script>

<style scoped>
.toolButton {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    margin-top: 10px;
}

p {
    font-size: 18px;
    margin-top: 10px;
}
</style>
