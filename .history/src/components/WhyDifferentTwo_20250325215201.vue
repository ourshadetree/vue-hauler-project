<template>
    <div id="whyDifferentContainer">
        <div id="title">
            <h1>2. Full Service Package for Owner Operators</h1>
            <p>We partner with fast-moving, technology-focused companies to bring you a full suite of essential services at premium pricing. Additionally, we only work partners who value customer support. Don't get left on hold for hours when you need help now.</p>
        </div>
        <div id="columns">
            <div id="left">
                <div id="chart">
                    <h2>Member Services</h2>
                    <div class="chart">
                        <div class="left">
                            <div class="title">
                                <h3>Fuel Card:</h3>
                                <div class="image">

                                </div>
                            </div>
                            <h4>Average discount 47¢ per gallon, up to $2.00 in certain markets</h4>
                        </div>
                        <div id="right">
                            <div class="link">
                                
                            </div>
                        </div>
                    </div>
                    <div class="chart">
                        <div class="left">
                            <div class="title">
                                <h3>Factoring:</h3>
                                <div class="image">

                                </div>
                            </div>
                            <h4>1.5% factoring rate, payments in 90 minutes for most invoices</h4>

                            
                        </div>
                        <div id="right">
                            <div class="link">
                                
                            </div>
                        </div>
                    </div>
                    <div class="chart">
                        <div class="left">
                            <div class="title">
                                <h3>Maintenance:</h3>
                                <div class="image">

                                </div>
                            </div>
                            <h4>Discounts on emergency roadside assistance 24/7, 365 </h4>
                        </div>
                        <div id="right">
                            <div class="link">
                                
                            </div>
                        </div>
                </div>
            </div>
            <div id="right">
                <div id="savingsCalculator">
                    <SavingsCalculator />
                </div>
            </div>
        </div>
        <div id="faq">
            <h3>FAQ</h3>
            <p>Participation in any and all member services are optional. You can opt-in and out of any of the above services at your discretion. There are no volume commitments or long-term contracts required to participate. All offers above are valid only for qualifying carriers.</p>
        </div>
        
    </div>
    </div>
</template>

<script>
import SavingsCalculator from '@/components/SavingsCalculator.vue';

export default {
    name: 'WhyDifferentTwo',

    components: {
        SavingsCalculator
    }
}

</script>

<style scoped>
#whyDifferentContainer {
    display: flex;
    flex-direction: column;
}

#columns {
    display: flex;
    flex-direction: row;
    width: 100%;
    max-width: 1200px;
    margin-top: 30px;
}

#left {
    flex: 1;
    
}

#right {
    flex: 1;
    
}
</style>