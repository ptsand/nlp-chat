import * as tf from '@tensorflow/tfjs';

// loop, while comparing the current value with the previous maximum,
// until the maximum value and corresponding index is obtained, grab the index
const argMax = (array) => 
    array.map((x, i) => [x, i])
         .reduce((max, curVal) => (curVal[0] > max[0] ? curVal : max))[1];

const seqLen = 60; // input message will be truncated/padded to this length (number of words)
// load model and vocab immediately
let vocabulary; // (toplevel await not broadly supported yet)
fetch("/tfjs-model/vocab.json").then(res=>res.json()).then((vocab=>vocabulary=vocab));
let model;
tf.loadLayersModel("/tfjs-model/model.json").then((m=>model = m));

const vectorize = (strArray, vocab) => {
    let text = strArray.map(str => str.toLowerCase());
    // strip punctuation (DEFAULT_STRIP_REGEX from tensorflow)
    text = text.map(str => str.replace(/[!"#$%&()\*\+,-\./:;<=>?@\[\\\]^_`{|}~\']/g,''));
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
    const predictions = tf.tidy(() => {
      const tokens = vectorize(text, vocabulary);
      const predictions = model.predict(tf.tensor2d(tokens, [tokens.length, seqLen]));
      return predictions;
    });
    const preds = await predictions.array();
    predictions.dispose(); // clean up
    return preds.map(seq => {
        let aMax = argMax(seq);
        return {
            category: ['Negative', 'Neutral', 'Positive'][aMax],
            confidence: seq[aMax].toFixed(4),
            aMax
        }
    });
}

export default predict;