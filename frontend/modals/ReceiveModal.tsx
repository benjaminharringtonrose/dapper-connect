import { Formik, FormikProps } from "formik";
import React, { forwardRef, Ref } from "react";
import { View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import * as Yup from "yup";

import { Button } from "../components/Button";
import { FormInput } from "../components/FormInput";
import { COLORS, SIZES } from "../constants";

export const ReceiveModal = forwardRef(
  ({ onPress }: { onPress: () => void }, ref: Ref<Modalize>) => {
    const ProfileSchema = Yup.object().shape({
      amout: Yup.string().required("Required"),
    });

    return (
      <Portal>
        <Modalize ref={ref} adjustToContentHeight={true} useNativeDriver={false}>
          <View style={{ minHeight: 200, backgroundColor: COLORS.black }}></View>
        </Modalize>
      </Portal>
    );
  }
);
