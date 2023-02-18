import React, { useState } from "react";
import {
  Container,
  Grid,
  Spacer,
  Textarea,
  Button,
  Input,
  Collapse,
} from "@nextui-org/react";
import quiet, { ab2str, str2ab, mergeab } from "quietjs-bundle";
import TitleComponent from "./components/TitleComponent";
import Blowfish from "javascript-blowfish";

function App() {
  const messageRef = React.useRef(null);
  const privateKeyRef = React.useRef(null);
  const messageLogRef = React.useRef(null);
  const [transmitterBusy, setTransmitterBusy] = useState(false);
  const [receiver, setReceiver] = useState(null);
  let payloadBuffer = new ArrayBuffer(0);

  function Timer(fn, t) {
    var timerObj = setTimeout(fn, t);

    this.stop = function () {
      if (timerObj) {
        clearTimeout(timerObj);
        timerObj = null;
      }
      return this;
    };

    // start timer using current settings (if it's not already running)
    this.start = function () {
      if (!timerObj) {
        this.stop();
        timerObj = setTimeout(fn, t);
      }
      return this;
    };

    // start with new or original interval, stop current interval
    this.reset = function (newT = t) {
      t = newT;
      return this.stop().start();
    };
  }

  const decryptPayload = () => {
    let decryptedPayload = ab2str(payloadBuffer);
    if (privateKeyRef.current.value) {
      const bf = new Blowfish(privateKeyRef.current.value);
      decryptedPayload = bf.trimZeros(bf.decrypt(bf.base64Decode(decryptedPayload)));
    }
    // Reset payloadBuffer
    payloadBuffer = new ArrayBuffer(0);

    messageRef.current.value = decryptedPayload;
    messageLogRef.current.value +=
      "\n--> [" +
      new Date().toLocaleDateString("et-EE", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }) +
      "]: " +
      decryptedPayload;
  };
  const timer = new Timer(decryptPayload, 1000);
  timer.stop();

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
        payloadBuffer = mergeab(payloadBuffer, payload);
        timer.reset();
      },
      onReceiveFail: (noOfFailedFrames) => {
        const timeNow = new Date();
        messageLogRef.current.value +=
          "\n--> [" +
          timeNow.toLocaleDateString("et-EE", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }) +
          "]: " +
          "Received frame checksum failed.";
      },
    });
    setReceiver(rx);
  };

  const transmitMessage = (payload) => {
    if (transmitterBusy || receiver || payload.length === 0) {
      return;
    }
    console.log(payload);
    let encryptedPayload = payload;
    if (privateKeyRef.current.value) {
      const bf = new Blowfish(privateKeyRef.current.value);
      encryptedPayload = bf.base64Encode(bf.encrypt(payload));
    }

    console.log(encryptedPayload);

    setTransmitterBusy(true);
    const tx = quiet.transmitter({
      profile: "audible",
      onFinish: () => {
        messageLogRef.current.value +=
          "\n<-- [" +
          new Date().toLocaleDateString("et-EE", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }) +
          "]: " +
          payload;
        setTransmitterBusy(false);
      },
    });
    tx.transmit(str2ab(encryptedPayload));
  };

  return (
    <>
      <Container>
        <Spacer y={1} />
        <TitleComponent />
        <Grid.Container gap={2}>
          <Grid
            xs={12}
            lg={6}
            css={{
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              <Input
                label="Secret passphrase"
                helperText="Enter your secret passphrase used for encryption"
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
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              <Textarea
                disabled={transmitterBusy}
                label="Message transmission"
                helperText="Enter or receive message"
                ref={messageRef}
                clearable
                rows={7}
                css={{
                  width: "100%",
                }}
              />
              <Button
                auto
                color="primary"
                disabled={transmitterBusy || receiver}
                onPress={() => {
                  transmitMessage(messageRef.current.value);
                }}
                css={{
                  marginTop: "$10",
                  marginRight: "$8",
                }}
              >
                {transmitterBusy ? "Sending..." : "Send"}
              </Button>
              <Button
                auto
                color={receiver ? "warning" : "success"}
                onPress={() => {
                  toggleReceiver();
                }}
                css={{
                  marginTop: "$10",
                  marginRight: "$8",
                }}
              >
                {receiver ? "Stop listening" : "Listen"}
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
            </div>
          </Grid>
          <Grid
            xs={12}
            lg={6}
            css={{
              flexWrap: "wrap",
              alignContent: "start",
            }}
          >
            <Collapse
              title="Message log"
              divider={false}
              css={{
                width: "100%",
              }}
            >
              <div>
                <Textarea
                  ref={messageLogRef}
                  minRows={7}
                  maxRows={20}
                  readOnly
                  css={{
                    width: "100%",
                  }}
                />
                <Spacer y={1} />
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <Button
                    auto
                    color="secondary"
                    onPress={() => (messageLogRef.current.value = null)}
                    css={{
                      marginLeft: "auto",
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </Collapse>
          </Grid>
        </Grid.Container>
        <Spacer y={2} />
      </Container>
    </>
  );
}

export default App;
