import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { defaultStyles } from "@/constants/Styles";
import { useAuth } from "@/hooks/useAuth";
import { ANDROID } from "nativewind/dist/utils/selector";
import AsyncStorage from "@react-native-async-storage/async-storage";

const login = () => {
  const { type } = useLocalSearchParams();
  const { top } = useSafeAreaInsets();
  const { isSignedIn, signOut } = useAuth();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const { signIn, error } = useAuth();
  const singInUser = async () => {
    if (username && password) {
      const e = await signIn({ username, password });
      if (e?.errorCode === 500) {
        setLoginAttempts(loginAttempts + 1);
        AsyncStorage.getItem("loginAttempts").then((value: any) => {
          const attempts = parseInt(value, 10) || 0;
          AsyncStorage.setItem("loginAttempts", (attempts + 1).toString());
        });
      }
    } else {
      ToastAndroid.show(
        "Please provide a username and password",
        ToastAndroid.LONG
      );
    }
  };
  useEffect(() => {
    console.log(loginAttempts);
    AsyncStorage.getItem("loginAttempts").then((value: any) => {
      setLoginAttempts(parseInt(value));
    });
  }, [loginAttempts]);
  useEffect(() => {
    if (loginAttempts > 2) {
      setTimeout(() => {
        AsyncStorage.setItem("loginAttempts", "0");
        setLoginAttempts(0);
      }, 10000);
    }
  }, [loginAttempts]);
  return (
    <View style={{ paddingTop: top }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 50,
        }}
      >
        <Image
          source={require("@/assets/images/logo.png")}
          style={{ height: 200, width: 200 }}
        />
      </View>
      <View>
        <Text style={[styles.title]}>Login</Text>
        <TextInput
          onChangeText={setUserName}
          placeholder="Enter your username"
          style={[styles.inputField]}
        />
        <TextInput
          onChangeText={setPassword}
          placeholder="Enter your password"
          style={[styles.inputField]}
        />
        <TouchableOpacity
          disabled={loginAttempts > 2 ? true : false}
          style={[
            defaultStyles.btn,
            { margin: 10, backgroundColor: "#00afec" },
          ]}
          onPress={singInUser}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
            {loginAttempts > 2 ? "You are locked out!" : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default login;
const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 28,
    padding: 10,
    color: "#00afec",
    fontWeight: "700",
  },
  inputField: {
    marginTop: 8,
    borderColor: "#00afec",
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
