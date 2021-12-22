import React from "react";
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { Modalize } from "react-native-modalize";

import { COLORS } from "../constants";

import { ListPicker } from "./ListPicker";

type FormDropListPickerProps = {
  readonly title?: string;
  readonly label?: string;
  readonly placeholder?: string;
  readonly value?: any;
  readonly items: any[];
  readonly onSelect: (value: any) => void;
  readonly error?: string;
  readonly touched?: boolean;
  readonly style?: StyleProp<ViewStyle>;
};

export const FormDropListPicker = (props: FormDropListPickerProps) => {
  const pickerRef = React.useRef<Modalize>(null);

  const onSelect = (item: any) => {
    props.onSelect(item);
    pickerRef.current?.close();
  };

  const onShow = () => {
    pickerRef.current?.open();
  };

  return (
    <>
      <TouchableOpacity
        style={[
          {
            minHeight: 40,
          },
          props.style,
        ]}
        onPress={onShow}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "column",
            }}
          >
            <View style={{ marginBottom: 5 }}>
              <Text
                style={{
                  fontWeight: "600",
                  color: COLORS.white,
                  paddingTop: 3,
                }}
              >
                {props.label}
              </Text>
            </View>
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingBottom: 5,
                borderBottomWidth: 2,
                borderBottomColor: COLORS.gray1,
              }}
            >
              <Text style={{ color: COLORS.white }}>
                {props.value || props?.placeholder || "Select..."}
              </Text>
              {/* <Icon name={"chevron-down"} size={16} color={colors.grey500} /> */}
            </View>
          </View>
          <ListPicker
            ref={pickerRef}
            headerTitle={props?.title || "Select An Option"}
            items={props.items}
            onBack={() => {
              pickerRef.current?.close();
            }}
            onSelect={onSelect}
            itemContainerStyle={{ alignItems: "flex-start" }}
          />
        </View>
      </TouchableOpacity>
      {!!props.error && !!props.touched && (
        <View>
          <Text
            style={{
              marginTop: 5,
              color: COLORS.red,
            }}
          >
            {props.error}
          </Text>
        </View>
      )}
    </>
  );
};
