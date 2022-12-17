// initialize
const argMax = (array) => array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
const seqLen = 40; // input dimension
// TODO:
const vocabulary = async () => fetch("http://localhost:8080/tfjs-model/vocab.json").then(res=>res.json());
const model = await tf.loadLayersModel("http://localhost:8080/tfjs-model/./model.json");

const vectorize = (strArray, vocab) => {
    // TODO: use the same filters as the TextVectorization layer in python!
    const text = strArray.map(str => str.toLowerCase());
    const splitted_text = text.map(str => str.split(' '));
    const tokens = splitted_text.map(sentence => sentence.map(word => {
        let index = vocab.indexOf(word);
        return index === -1 ? 1 : index;  // oov words should map to index 1
    }));

    return tokens.map(seq => {
        // truncate/pad to seqLen
        if (seq.length > seqLen) {
            return seq.slice(0, seqLen);  // truncate from end
        }
        else if (seq.length < seqLen) {
            return seq.concat(Array(seqLen - seq.length).fill(0));    // append padding
        }
    });                            
}

const predict = async (text) => {
    const vocab = await vocabulary();
    // const model = await model();
    const predictions = tf.tidy(() => {
      // const text = document.getElementById("myText").value;
      const tokens = vectorize(text, vocab);
      // console.log(tokens);
      const predictions = model.predict(tf.tensor2d(tokens, [tokens.length, seqLen]));
      return predictions;
    });
    const preds = await predictions.array();
    // console.log("preds", preds);
    const sentiment_classes = ['Negative', 'Neutral', 'Positive'];
    predictions.dispose();
    // console.log(classIDs);
    return preds.map(seq => {
        let aMax = argMax(seq);
        return { category: sentiment_classes[aMax], confidence: seq[aMax].toFixed(4), aMax }
    });
}

export default predict;