Rails.application.routes.draw do
   root "pages#home"

  if Rails.env.development?
  mount LetterOpenerWeb::Engine, at: "/letter_opener"
  end

  # Defines the root path route ("/")
  # root "posts#index"

  # Keep this only if you're using a non-namespaced version
  # get "products", to: "billings#products"

  namespace :api do
    resources :billings, only: [ :create ] do
      collection do
        get :products, action: :products
        get :denominations, action: :denominations
      end
    end
  end
end
