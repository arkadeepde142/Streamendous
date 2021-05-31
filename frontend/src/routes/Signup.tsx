import * as React from "react";
import {
  Box,
  Text,
  Link,
  VStack,
  Grid,
  GridItem,
  Input,
  Button,
} from "@chakra-ui/react";
import validator from "validator";
import axios from "axios";
import {UserContext, User} from "../contexts"
import {
  Formik,
  Form,
  Field,
  FieldInputProps,
  FormikBag,
  FormikProps,
  FieldAttributes,
  FieldProps,
} from "formik";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/form-control";
import { Link as RouterLink, Redirect, useHistory } from "react-router-dom";
interface SignupRecord {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  username: string;
}
function validateEmail(value: string): string | undefined {
  let error;
  if (!validator.isEmail(value)) {
    error = "fuck off";
  }
  return error;
}
function validatePasswordStrong(value: string): string | undefined {
  let error;
  if (!validator.isStrongPassword(value)) {
    error = "fuck off";
  }
  return error;
}
function confirmPassword (value: string, password: string): string | undefined {
  let error;
  if(password!==value){
    error = "bullshit password doesnt match bitch"
  }
  console.log(password!==value)
  return error
}
export const Signup = () => {
  const [user, setUser] = React.useContext(UserContext)
  const [password, setPassword] = React.useState("")
  const history = useHistory();
  return user?
  <Redirect to={"/"}/>
  :(
    <Box textAlign="center" fontSize="xl" pl={40} pr={40} pt={15}>
      <Grid minH="100vh" p={3} margin={"auto"}>
        <Formik
          initialValues={{
            email: "",
            firstName: "",
            lastName: "",
            username: "",
            password: "",
          }}
          onSubmit={async (values, actions) => {
            try {
              const result = await axios.post(
                "http://localhost:5000/auth/signup",
                values,
                {withCredentials: true}
              );
              history.push("/login");
            } catch (error) {
              const errorResponse = error.response.data;
              if (errorResponse.field) {
                // actions.setStatus(errorResponse)
                actions.setFieldError(
                  errorResponse.field,
                  errorResponse.message
                );
              }
            }
          }}
        >
          {(props: FormikProps<SignupRecord>) => (
            <Form>
              <Field type="email" name="email" validate={validateEmail}>
                {({
                  field,
                  form,
                }: FieldProps<string, { email: SignupRecord["email"] }>) => (
                  <FormControl
                    isInvalid={
                      (form.errors.email && form.touched.email) as boolean
                    }
                    isRequired
                  >
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input {...field} id="email" placeholder="Email" />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field type="firstName" name="firstName">
                {({
                  field,
                  form,
                }: FieldProps<
                  string,
                  { firstName: SignupRecord["firstName"] }
                >) => (
                  <FormControl isRequired>
                    <FormLabel htmlFor="firstName">First name</FormLabel>
                    <Input {...field} id="firstName" placeholder="First name" />
                  </FormControl>
                )}
              </Field>
              <Field type="lastName" name="lastName">
                {({
                  field,
                  form,
                }: FieldProps<
                  string,
                  { lastName: SignupRecord["lastName"] }
                >) => (
                  <FormControl isRequired>
                    <FormLabel htmlFor="lastName">Last name</FormLabel>
                    <Input {...field} id="lastName" placeholder="Last name" />
                  </FormControl>
                )}
              </Field>
              <Field type="username" name="username">
                {({
                  field,
                  form,
                }: FieldProps<
                  string,
                  { username: SignupRecord["username"] }
                >) => (
                  <FormControl
                    isInvalid={
                      (form.errors.username && form.touched.username) as boolean
                    }
                    isRequired
                  >
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <Input {...field} id="username" placeholder="Username" />
                    <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field
                type="password"
                name="password"
                validate={validatePasswordStrong}
              >
                {({
                  field,
                  form,
                }: FieldProps<
                  "password",
                  { password: SignupRecord["password"] }
                >) => {
                  setPassword(field.value)
                  return(
                  <FormControl
                    isInvalid={
                      (form.errors.password && form.touched.password) as boolean
                    }
                    isRequired
                  >
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input
                      {...field}
                      id="password"
                      placeholder="Password"
                      type="password"
                    />
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}}
              </Field>
              <Field
                type="password"
                name="confirmPassword"
                validate={(value:string) => confirmPassword(value, password)}
              >
                {({
                  field,
                  form,
                }: FieldProps<
                  "password",
                  { confirmPassword: SignupRecord["password"] }
                >) => (
                  <FormControl
                    isInvalid={
                      (form.errors.confirmPassword && form.touched.confirmPassword) as boolean
                    }
                    isRequired
                  >
                    <FormLabel htmlFor="confirmPassword">Confirm password</FormLabel>
                    <Input
                      {...field}
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      type="password"
                    />
                    <FormErrorMessage>{form.errors.confirmPassword}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button
                mt={4}
                color="brand.800"
                isLoading={props.isSubmitting}
                type="submit"
                variant="outline"
                outline="2px"
                outlineColor="brand.800"
              >
                Sign up
              </Button>
            </Form>
          )}
        </Formik>
      </Grid>
    </Box>
  );
};
