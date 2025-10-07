import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Linking, Platform, Text, TextProps } from 'react-native';

type ExternalLinkProps = TextProps & { href: string };

export function ExternalLink(props: ExternalLinkProps) {
  const { href, onPress, ...rest } = props;
  const handlePress = async () => {
    if (Platform.OS !== 'web') {
      await WebBrowser.openBrowserAsync(href);
    } else {
      Linking.openURL(href);
    }
  };
  return <Text accessibilityRole="link" onPress={onPress ?? handlePress} {...rest} />;
}
