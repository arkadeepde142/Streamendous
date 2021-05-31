import * as React from "react";
import { Box, Grid, Input, Button, Flex, Text } from "@chakra-ui/react";
import validator from "validator";
import axios from "axios";
import { User } from "../contexts";
import theme from "../theme";
import { Formik, Form, Field, FormikProps, FieldProps } from "formik";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/form-control";
import { Link as RouterLink, Redirect, useHistory } from "react-router-dom";
import userContext from "../contexts/UserContext";
interface LoginRecord {
  email: string;
  password: string;
}
export interface LoginResult {
  accessToken: {
    token: string;
    expires: number;
    issued: number;
  };
  user: {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
  };
}
function validateEmail(value: string): string | undefined {
  let error;
  if (!validator.isEmail(value)) {
    error = "fuck off";
  }
  return error;
}

export const Login = () => {
  const [user, setUser] = React.useContext(userContext);
  const history = useHistory();
  return user ? (
    <Redirect to={"/"} />
  ) : (
    <Flex
      fontSize="xl"
      minH="100vh"
      minW={"100vw"}
      p={30}
      alignItems="center"
      justifyContent="center"
      flexDir="column"
    >
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={async (values, actions) => {
          try {
            const result = await axios.post(
              "http://localhost:5000/auth/login",
              values,
              { withCredentials: true }
            );
            const loginResponse = result.data as LoginResult;
            const _user: User = {
              email: loginResponse.user.email,
              username: loginResponse.user.username,
              firstName: loginResponse.user.firstName,
              lastName: loginResponse.user.lastName,
              token: loginResponse.accessToken.token,
            };
            setUser(_user);
            // history.push("/");
          } catch (error) {
            const errorResponse = error.response.data;
            console.log(errorResponse);
            if (errorResponse.message) {
              // actions.setStatus(errorResponse)
              actions.setFieldError("password", errorResponse.message);
            }
          }
        }}
      >
        {(props: FormikProps<LoginRecord>) => (
          <Flex>
            <Form>
              <Field type="email" name="email" validate={validateEmail}>
                {({
                  field,
                  form,
                }: FieldProps<string, { email: LoginRecord["email"] }>) => (
                  <FormControl
                    isInvalid={
                      (form.errors.email && form.touched.email) as boolean
                    }
                    isRequired
                    w={["90vw", "70vw"]}
                  >
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      {...field}
                      id="email"
                      placeholder="Email"
                      backgroundColor="#d3d3d3"
                      _focus={{ outline: "0px" }}
                      _placeholder={{ color: "brand.900" }}
                      color={"brand.900"}
                    />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field type="password" name="password">
                {({
                  field,
                  form,
                }: FieldProps<
                  "password",
                  { password: LoginRecord["password"] }
                >) => {
                  return (
                    <FormControl
                      isInvalid={
                        (form.errors.password &&
                          form.touched.password) as boolean
                      }
                      isRequired
                      w={["90vw", "70vw"]}
                    >
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Input
                        {...field}
                        id="password"
                        placeholder="Password"
                        type="password"
                        backgroundColor="#d3d3d3"
                        _focus={{ outline: "0px" }}
                        _placeholder={{ color: "brand.900" }}
                        color={"brand.900"}
                      />
                      <FormErrorMessage>
                        {form.errors.password}
                      </FormErrorMessage>
                    </FormControl>
                  );
                }}
              </Field>
              <Flex justifyContent="center" alignItems="center">
                <Button
                  mt={[5, 10]}
                  color="brand.800"
                  isLoading={props.isSubmitting}
                  type="submit"
                  variant="outline"
                  outline="2px"
                >
                  Log in
                </Button>
              </Flex>
            </Form>
          </Flex>
        )}
      </Formik>
      <Text mt="10">Do not have an account ?</Text>
      <Button
        as={RouterLink}
        mt={[2, 4]}
        color="brand.700"
        to="/signup"
        variant="outline"
        outline="2px"
      >
        Sign up
      </Button>
    </Flex>
  );
};
