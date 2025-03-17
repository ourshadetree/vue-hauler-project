<template>
  <div id="loadBoardContainer">
    <div id="content">
      <h1>🚛 Load Board - Coming Soon!</h1>
      <h3>Connect with freight. Maximize your earnings.</h3>
      <p>
        Our Load Board will give truckers instant access to available loads nationwide.
        Find, claim, and haul jobs with ease—all in one place.
      </p>
      <p>
        <strong>Stay tuned!</strong> We're working hard to launch a powerful tool for
        truckers like you to keep your wheels rolling and profits growing.
      </p>
      <button @click="notifyMe">Get Notified</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadBoard',
  setup() {
    const notifyMe = () => {
      alert('Stay tuned! We’ll notify you when the Load Board goes live.');
    };

    return {
      notifyMe
    };
  }
};
</script>

<style scoped>
#loadBoardContainer {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 40px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

#content h1 {
  color: pink;
  font-weight: 900;
  margin-bottom: 10px;
}

#content h3 {
  color: #073763;
  font-weight: bold;
  margin-bottom: 20px;
}

#content p {
  color: #2c3e50;
  font-size: 1.1rem;
  margin-bottom: 15px;
}

button {
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  background-color: #073763;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background-color: #09457a;
}
</style>
