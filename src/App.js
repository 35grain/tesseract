import React, { useState } from "react";
import {
  Container,
  Grid,
  Text,
  Spacer,
  Textarea,
  Button,
} from "@nextui-org/react";
import quiet, { ab2str } from "quietjs-bundle";

function App() {
  const messageRef = React.useRef(null);
  const privateKeyRef = React.useRef(null);
  const receivedMessagesRef = React.useRef(null);
  const [interfaceBusy, setInterfaceBusy] = useState(false);
  quiet.addReadyCallback(() => {
    console.log("Ready to transmit or listen...");
    /* quiet.receiver({
      profile: "audible",
      onReceive(payload) {
        console.log(quiet.ab2str(payload));
      },
    }); */
  });

  const receiveMessages = () => {
    if (interfaceBusy) {
      return;
    }
    const rx = quiet.receiver({
      profile: "audible",
      onReceive: (payload) => {
        const receivedMessage = ab2str(payload);
        console.log("Message received.");
        console.log(receivedMessage);
      },
    });
  };

  const transmitMessage = (payload) => {
    if (interfaceBusy) {
      return;
    }
    setInterfaceBusy(true);
    const tx = quiet.transmitter({
      profile: "audible",
      onFinish: () => {
        console.log("Transmission end!");
        setInterfaceBusy(false);
      },
    });
    tx.transmit(quiet.str2ab(payload));
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
          Tessarect
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
            css={{
              flexWrap: "wrap",
            }}
          >
            <Textarea
              disabled
              label="Received messages"
              ref={receivedMessagesRef}
              clearable
              rows={7}
              css={{
                width: "100%",
              }}
            />
            <Button
              auto
              color="secondary"
              onPress={() => (receivedMessagesRef.current.value = null)}
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
            css={{
              flexWrap: "wrap",
            }}
          >
            <Textarea
              label="Message"
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
              disabled={interfaceBusy}
              onPress={() => {
                transmitMessage(messageRef.current.value);
              }}
              css={{
                marginTop: "$10",
                marginRight: "$10",
              }}
            >
              {interfaceBusy ? "Sending..." : "Send"}
            </Button>
            <Button
              auto
              color="secondary"
              onPress={() => (messageRef.current.value = null)}
              css={{
                marginTop: "$10",
                marginLeft: "auto",
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
