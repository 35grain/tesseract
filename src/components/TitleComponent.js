import { Text } from "@nextui-org/react";

function TitleComponent() {
  return (
    <Text
      h2
      css={{
        textGradient: "45deg, rgba(146,34,195,1) 0%, rgba(162,38,35,1) 100%",
        textAlign: "center",
      }}
    >
      Tesseract
      <Text
        size={16}
        as="span"
        css={{
          display: "block",
          letterSpacing: "$normal",
        }}
      >
        Data over audio
      </Text>
    </Text>
  );
}

export default TitleComponent;
