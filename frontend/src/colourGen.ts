const randomHex = () => {
    const strength = Math.ceil(Math.random() * 50 + 180);
    return strength.toString(16);
  }

const randomColour = () => `#${randomHex()}${randomHex()}${randomHex()}`;
export default randomColour;