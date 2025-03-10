<template>
    <button class="toolButton" @click="fetchNationalAverage"></button>
    <p v-if="averagePrice !== null">Average Retail Price: {{ averagePrice }}</p>
</template>

<script>
import { ref } from 'vue';
import { supabase } from '../supabaseClient';

export default {
    name: "NationalAverageTool",

    setup() {
        const averagePrice = ref(null);

        async function fetchNationalAverage() {
            try {
                const { data, error } = await supabase
                    .from('national_avg')
                    .select('price')
                    .order('date', { ascending: false })
                    .limit(1);

                if (error) {
                    console.error('Error fetching national average:', error);
                } else if (data.length > 0) {
                    averagePrice.value = data[0].price;
                } else {
                    console.log('No data found');
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