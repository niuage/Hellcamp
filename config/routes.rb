Campfire::Application.routes.draw do
  resources :rooms do
    resources :messages
  end

  root :to => "home#index"

  resources :home do
    collection do
      get :server
    end
  end
end
