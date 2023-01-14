import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/svelte';
import { vi } from 'vitest';
import ChatMsg from '../components/Chat/Message.svelte';

// mock language model
vi.mock('../utils/model.js', () => {
    return {
        default: { predict: () => [{
            category: 'Neutral',
            confidence: 0.9998,
            aMax: 1
        }]}
    }
});
// mock bootstrap Popover class with callable constructer
const bootstrap = {
    Popover: class Popover {
        constructor(element) {
            ()=>{}; // noop
        }
    }
};
vi.stubGlobal('bootstrap', bootstrap);

test('shows a message when rendered', () => {
    const testMsg = {
        id: 0,
        sender: 'bot',
        content: "Welcome to the chat lounge, please click on any message to make me process it"
    };
    render(ChatMsg, { msg: testMsg });
    const msgContent = screen.getByText(testMsg.content);
    expect(msgContent).toBeInTheDocument();
});