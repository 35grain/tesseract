import React, { useState } from "react";
import {
  Container,
  Grid,
  Text,
  Spacer,
  Textarea,
  Button,
  Popover,
} from "@nextui-org/react";
import quiet, { ab2str, str2ab, mergeab } from "quietjs-bundle";

function App() {
  const messageRef = React.useRef(null);
  const privateKeyRef = React.useRef(null);
  const receivedMessagesRef = React.useRef(null);
  const [transmitterBusy, setTransmitterBusy] = useState(false);
  const [receiver, setReceiver] = useState(null);
  const toggleReceiver = () => {
    if (receiver) {
      receiver.destroy();
      setReceiver(null);
      return;
    }
    if (transmitterBusy) {
      return;
    }
    const rx = quiet.receiver({
      profile: "audible",
      onReceive: (payload) => {
        const receivedMessage = ab2str(payload);
        receivedMessagesRef.current.value += receivedMessage + "\n";
      },
      onReceiveFail: (noOfFailedFrames) => {
        receivedMessagesRef.current.value +=
          "Received frame checksum failed.\n";
      },
    });
    setReceiver(rx);
  };

  const transmitMessage = (payload) => {
    if (transmitterBusy || receiver) {
      return;
    }
    setTransmitterBusy(true);
    const tx = quiet.transmitter({
      profile: "audible",
      onFinish: () => {
        console.log("Transmission end!");
        setTransmitterBusy(false);
      },
    });
    tx.transmit(str2ab(payload));
  };

  return (
    <>
      <Container>
        <Spacer y={2} />
        <Text
          h1
          css={{
            textGradient:
              "45deg, rgba(146,34,195,1) 0%, rgba(162,38,35,1) 100%",
            textAlign: "center",
          }}
        >
          Tesseract
          <Text
            size={20}
            as="span"
            css={{
              display: "block",
            }}
          >
            Data over audio
          </Text>
        </Text>
        <Spacer y={3} />
        <Grid.Container gap={3}>
          <Grid
            xs={12}
            css={{
              flexWrap: "wrap",
            }}
          >
            <Textarea
              label="Private passphrase"
              helperText="Enter your private key for encryption"
              ref={privateKeyRef}
              clearable
              rows={7}
              css={{
                width: "100%",
              }}
            />
            <Button
              auto
              color="secondary"
              onPress={() => (privateKeyRef.current.value = null)}
              css={{
                marginTop: "$10",
                marginLeft: "auto",
              }}
            >
              Clear
            </Button>
          </Grid>
          <Grid
            xs={12}
            lg={6}
            css={{
              flexWrap: "wrap",
            }}
          >
            <Textarea
              readOnly
              label="Received messages"
              ref={receivedMessagesRef}
              clearable
              rows={7}
              css={{
                width: "100%",
              }}
            />
            <Button
              color={receiver ? "warning" : "success"}
              onPress={() => {
                toggleReceiver();
              }}
              css={{
                marginTop: "$10",
                marginRight: "$10",
              }}
            >
              {receiver ? "Stop listening" : "Listen"}
            </Button>
            <Popover>
              <Popover.Trigger>
                <Button
                  auto
                  css={{
                    marginTop: "$10",
                    marginLeft: "auto",
                    background: "$blue700",
                  }}
                  onPress={() =>
                    navigator.clipboard.writeText(
                      receivedMessagesRef.current.value
                    )
                  }
                >
                  Copy
                </Button>
              </Popover.Trigger>
              <Popover.Content css={{ p: "$8" }}>
                {"Messages copied to clipboard"}
              </Popover.Content>
            </Popover>
            <Button
              auto
              color="secondary"
              onPress={() => (receivedMessagesRef.current.value = null)}
              css={{
                marginTop: "$10",
                marginLeft: "$10",
              }}
            >
              Clear
            </Button>
          </Grid>
          <Grid
            xs={12}
            lg={6}
            css={{
              flexWrap: "wrap",
            }}
          >
            <Textarea
              disabled={transmitterBusy}
              label="Send message"
              helperText="Enter your message to transmit"
              ref={messageRef}
              clearable
              rows={7}
              css={{
                width: "100%",
              }}
            />
            <Button
              color="success"
              disabled={transmitterBusy}
              onPress={() => {
                transmitMessage(messageRef.current.value);
              }}
              css={{
                marginTop: "$10",
                marginRight: "auto",
              }}
            >
              {transmitterBusy ? "Sending..." : "Send"}
            </Button>
            <Button
              auto
              color="secondary"
              onPress={() => (messageRef.current.value = null)}
              css={{
                marginTop: "$10",
                marginLeft: "$10",
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid.Container>
      </Container>
    </>
  );
}

export default App;
