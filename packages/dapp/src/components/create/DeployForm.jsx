import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { useDeployCollection } from 'hooks/useDeployCollection';
import React, { useState } from 'react';

export const DeployForm = () => {
  const [deployedAddress, setDeployedAddress] = useState('-');

  const { deploy } = useDeployCollection();

  function validateName(value) {
    let error;
    if (!value) {
      error = 'Name is required';
    }
    return error;
  }

  function validateSymbol(value) {
    let error;
    if (!value) {
      error = 'Name is required';
    }
    return error;
  }

  return (
    <Formik
      initialValues={{}}
      onSubmit={async (values, actions) => {
        const address = await deploy(values.name, values.symbol);
        setDeployedAddress(address);
        actions.setSubmitting(false);
      }}
    >
      {props => (
        <Form>
          <Field name="name" validate={validateName}>
            {({ field, form }) => (
              <FormControl isInvalid={form.errors.name && form.touched.name}>
                <FormLabel>Name</FormLabel>
                <Input {...field} placeholder="Your collection name" />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name="symbol" validate={validateSymbol}>
            {({ field, form }) => (
              <FormControl
                isInvalid={form.errors.symbol && form.touched.symbol}
              >
                <FormLabel>Symbol</FormLabel>
                <Input {...field} placeholder="Your collection symbol" />
                <FormErrorMessage>{form.errors.symbol}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={props.isSubmitting}
            type="submit"
          >
            Deploy
          </Button>
          <Text>Contract deployed at: {deployedAddress}</Text>
        </Form>
      )}
    </Formik>
  );
};
