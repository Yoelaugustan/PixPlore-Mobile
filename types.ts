import { StyleProp, TextInput, TextInputProps, TextStyle, TouchableOpacityProps, ViewStyle } from "react-native"

export type ScreenWrapperProps = {
    style?: ViewStyle;
    children: React.ReactNode;
    isModal?: boolean;
}

export interface InputProps extends TextInputProps {
    icon?: React.ReactNode;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    inputRef?: React.RefObject<TextInput>;
}

export type BackButtonProps = {
    style?: ViewStyle;
    iconSize?: number;
}

export interface CustomButtonProps extends TouchableOpacityProps {
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
    loading?: boolean;
    children: React.ReactNode;
}