import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { Field, Form, Formik } from 'formik';
import { useMintNFT } from 'hooks/useMintNFT';
import React from 'react';

export const MintNFTForm = () => {
  const { mint } = useMintNFT();
  function validateAddress(value) {
    let error;
    if (!value) {
      error = 'Address is required';
    }
    if (!ethers.utils.isAddress(value)) {
      error = 'Address is not valid';
    }

    return error;
  }

  function validateURI(value) {
    let error;
    if (!value) {
      error = 'URI is required';
    }
    return error;
  }

  return (
    <Formik
      initialValues={{
        uri: 'ipfs://bafyreihc4jmbh3bhm4z7ziln57ljnfnsba2ccralgj5j3urwptirbrswma/metadata.json',
      }}
      onSubmit={async (values, actions) => {
        await mint(values.address, values.uri);

        actions.setSubmitting(false);
      }}
    >
      {props => (
        <Form>
          <Field name="address" validate={validateAddress}>
            {({ field, form }) => (
              <FormControl
                isInvalid={form.errors.address && form.touched.address}
              >
                <FormLabel>Collection Address</FormLabel>
                <Input {...field} placeholder="Your cotnract address" />
                <FormErrorMessage>{form.errors.address}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name="uri" validate={validateURI}>
            {({ field, form }) => (
              <FormControl isInvalid={form.errors.uri && form.touched.uri}>
                <FormLabel>NFT URI</FormLabel>
                <Input {...field} placeholder="Your token uri" />
                <FormErrorMessage>{form.errors.uri}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={props.isSubmitting}
            type="submit"
          >
            Mint
          </Button>
        </Form>
      )}
    </Formik>
  );
};
